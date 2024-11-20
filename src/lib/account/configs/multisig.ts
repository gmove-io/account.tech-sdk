import { Transaction, TransactionArgument, TransactionObjectInput, TransactionResult } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { Account as AccountRaw } from "../../../.gen/account-protocol/account/structs";
import { Multisig as MultisigRaw, Approvals as ApprovalsRaw } from "../../../.gen/account-config/multisig/structs";
import { newAccount } from "../../../.gen/account-config/multisig/functions";
import { share } from "../../../.gen/account-protocol/account/functions";
import * as configMultisig from "../../../.gen/account-config/multisig/functions";
import * as config from "../../../.gen/account-actions/config/functions";
import * as currency from "../../../.gen/account-actions/currency/functions";
import * as kiosk from "../../../.gen/account-actions/kiosk/functions";
import { approveProposal, disapproveProposal, executeProposal, authenticate, emptyOutcome, join, leave } from "../../../.gen/account-config/multisig/functions"
import { DepFields } from "../../../.gen/account-protocol/deps/structs";
import { MemberFields, RoleFields } from "../../../.gen/account-config/multisig/structs";
import { ProposalFields as ProposalFieldsRaw } from "../../../.gen/account-protocol/proposals/structs";
import { CLOCK, EXTENSIONS, ACCOUNT_ACTIONS, ACCOUNT_CONFIG, MULTISIG_GENERICS } from "../../../types/constants";
import { User } from "../../user";
import { Proposal } from "../../proposal/proposal";
import { ConfigDepsProposal } from "../../proposal/proposals/config";
import { Dep, Role, MemberAccount, AccountType, MultisigData } from "../../../types/account-types";
import { BurnArgs, ConfigDepsArgs, ConfigMultisigArgs, MintArgs, ProposalArgs, ProposalFields, UpdateArgs } from "../../../types/proposal-types";
import { TransactionPureInput } from "src/types/helper-types";
import { BurnProposal, MintProposal, UpdateProposal } from "../../proposal/proposals/currency";
import { Account } from "../account";
import { Outcome } from "src/lib/proposal/outcome";
import { Approvals } from "src/lib/proposal/outcomes/approvals";

export class Multisig extends Account {
    roles: Map<string, Role> = new Map();
    members: MemberAccount[] = [];

    static async init(
        client: SuiClient,
        userAddr: string,
        multisigId?: string,
    ): Promise<Multisig> {
        const multisig = new Multisig(client);
        multisig.userAddr = userAddr;
        if (multisigId) {
            multisig.id = multisigId;
            multisig.setMultisig(await multisig.fetchMultisig(multisigId));
        }
        return multisig;
    }

    async fetchMultisig(id: string): Promise<MultisigData> {
        const { data } = await this.client.getObject({
            id,
            options: { showContent: true }
        });

        if (!data?.content) throw new Error(`Multisig with id ${id} not found.`);

        const accountReified = AccountRaw.r(MultisigRaw.r, ApprovalsRaw.r);
        const multisigReified = accountReified.fromSuiParsedData(data.content);

        // get deps
        const deps: Dep[] = multisigReified.deps.inner.map((dep: DepFields) => {
            return { name: dep.name, addr: dep.addr, version: Number(dep.version) };
        });

        // get all members" data (from account and member)
        const membersAddress: string[] = multisigReified.config.members.map((member: MemberFields) => member.addr);
        const members = await Promise.all(membersAddress.map(async memberAddr => {
            const weight = multisigReified.config.members.find((m: MemberFields) => m.addr == memberAddr)?.weight;
            const roles = multisigReified.config.members.find((m: MemberFields) => m.addr == memberAddr)?.roles.contents;
            const user = await User.init(this.client, this.userAddr, AccountType.MULTISIG);
            const UserData = await user.fetchUser(memberAddr);
            return {
                address: memberAddr,
                accountId: UserData?.id!,
                username: UserData?.username!,
                avatar: UserData?.avatar!,
                weight: Number(weight)!,
                roles: roles!
            }
        }));

        // calculate total weights
        const globalWeight = members.reduce((acc, member) => acc + member.weight, 0);
        // Calculate total weights for each role
        const roleWeights = new Map<string, number>();
        members.forEach(member => {
            member.roles.forEach(role => {
                const currentWeight = roleWeights.get(role) || 0;
                roleWeights.set(role, currentWeight + member.weight);
            });
        });
        // get thresholds
        const roles = new Map<string, Role>();
        roles.set("global", { threshold: Number(multisigReified.config.global), totalWeight: globalWeight });
        multisigReified.config.roles.forEach((role: RoleFields) => {
            roles.set(role.name, { threshold: Number(role.threshold), totalWeight: roleWeights.get(role.name) || 0 });
        });
        // get Proposals with actions
        const proposals = await Promise.all(multisigReified!.proposals.inner.map(async (fieldsRaw: ProposalFieldsRaw<ApprovalsRaw>) => {
            const outcome = new Approvals(this.id, fieldsRaw.key, Number(fieldsRaw.outcome.totalWeight), Number(fieldsRaw.outcome.roleWeight), fieldsRaw.outcome.approved.contents);
            const fields: ProposalFields = {
                issuer: {
                    accountAddr: fieldsRaw.issuer.accountAddr,
                    roleType: fieldsRaw.issuer.roleType.name,
                    roleName: fieldsRaw.issuer.roleName,
                },
                key: fieldsRaw.key,
                description: fieldsRaw.description,
                executionTime: Number(fieldsRaw.executionTime),
                expirationTime: Number(fieldsRaw.expirationTime),
                actionsId: fieldsRaw.actions.id,
            }

            return await this.initProposalWithActions(this.client, outcome, fields);
        }));

        return {
            id: multisigReified.id,
            name: multisigReified.metadata.inner.contents.find((m: any) => m.key == "name")?.value!,
            deps,
            roles,
            members,
            proposals,
        }
    }

    setMultisig(multisig: MultisigData) {
        this.id = multisig.id;
        this.name = multisig.name;
        this.deps = multisig.deps;
        this.roles = multisig.roles;
        this.members = multisig.members;
        this.proposals = multisig.proposals;
    }

    getMultisig(): MultisigData {
        return {
            id: this.id,
            name: this.name,
            deps: this.deps,
            roles: this.roles,
            members: this.members,
            proposals: this.proposals,
        }
    }

    getProposal(key: string): Proposal {
        const proposal = this.proposals?.find(p => p.fields.key == key);
        if (!proposal) {
            throw new Error(`Proposal with key ${key} not found.`);
        }
        return proposal;
    }

    getMemberWeight(addr: string): number {
        const member = this.members?.find(m => m.address == addr);
        if (!member) {
            throw new Error(`Member with address ${addr} not found.`);
        }
        return member.weight;
    }

    newMultisig(
        tx: Transaction,
        name: string,
    ): TransactionResult {
        return newAccount(
            tx,
            { extensions: EXTENSIONS, name }
        );
    }

    shareMultisig(tx: Transaction, multisig: TransactionArgument): TransactionResult {
        return share(tx, MULTISIG_GENERICS, multisig);
    }

    joinMultisig(tx: Transaction, user: TransactionPureInput, account: TransactionObjectInput): TransactionResult {
        return join(tx, { user, account });
    }

    leaveMultisig(tx: Transaction, user: TransactionObjectInput, account: TransactionObjectInput): TransactionResult {
        return leave(tx, { user, account });
    }

    authenticate(tx: Transaction, role: string): TransactionResult {
        return authenticate(tx, { extensions: EXTENSIONS, account: this.id, role });
    }

    emptyOutcome(tx: Transaction): TransactionResult {
        return emptyOutcome(tx, this.id);
    }

    approveProposal(
        tx: Transaction,
        key: string,
        multisig: TransactionObjectInput = this.id,
    ): TransactionResult {
        return approveProposal(tx, { account: multisig, key });
    }

    disapproveProposal(
        tx: Transaction,
        key: string,
        multisig: TransactionObjectInput = this.id,
    ): TransactionResult {
        return disapproveProposal(tx, { account: multisig, key });
    }

    executeProposal(
        tx: Transaction,
        key: string,
        multisig: TransactionObjectInput = this.id,
    ): TransactionResult {
        return executeProposal(tx, { account: multisig, key, clock: CLOCK });
    }

    // === Atomic Proposals ===

    configMultisig(
        tx: Transaction,
        proposalArgs: ProposalArgs,
        actionsArgs: ConfigMultisigArgs,
        multisig: TransactionObjectInput = this.id, // need for adding members upon creation
    ): TransactionResult {
        this.assertMultisig();
        this.assertKey(proposalArgs);

        let addresses: string[] = [];
        let weights: bigint[] = [];
        let roles: string[][] = [];
        if (actionsArgs.members) {
            actionsArgs.members.forEach((member) => {
                addresses.push(member.address);
                weights.push(BigInt(member.weight));
                roles.push(member.roles);
            });
        }

        let global = 0n;
        let roleNames: string[] = [];
        let roleThresholds: bigint[] = [];
        if (actionsArgs.thresholds) {
            global = BigInt(actionsArgs.thresholds.global);
            actionsArgs.thresholds.roles.forEach((role) => {
                roleNames.push(role.name);
                roleThresholds.push(BigInt(role.threshold));
            });
        }

        configMultisig.proposeConfigMultisig(
            tx,
            {
                extensions: EXTENSIONS,
                account: this.id,
                key: proposalArgs.key,
                description: proposalArgs.description ?? "",
                executionTime: BigInt(proposalArgs.executionTime ?? 0),
                expirationTime: BigInt(proposalArgs.expirationEpoch ?? Math.floor(Date.now()) + 7*24*60*60*1000),
                addresses,
                weights,
                roles,
                global,
                roleNames,
                roleThresholds,
            }
        );

        this.approveProposal(tx, proposalArgs.key);
        const executable = this.executeProposal(tx, proposalArgs.key);

        return configMultisig.executeConfigMultisig(tx, { executable, account: multisig });
    }

    configDeps(
        tx: Transaction,
        auth: TransactionObjectInput,
        outcome: TransactionObjectInput,
        proposalArgs: ProposalArgs,
        actionsArgs: ConfigDepsArgs,
        multisig: TransactionObjectInput = this.id, // need for adding deps upon creation
    ): TransactionResult {
        this.assertMultisig();
        this.assertKey(proposalArgs);

        const names: string[] = [];
        const addresses: string[] = [];
        const versions: bigint[] = [];
        actionsArgs.deps.forEach((dep) => {
            names.push(dep.name);
            addresses.push(dep.addr);
            versions.push(BigInt(dep.version));
        });

        config.proposeConfigDeps(
            tx,
            MULTISIG_GENERICS,
            {
                auth,
                account: multisig,
                outcome,
                key: proposalArgs.key,
                description: proposalArgs.description ?? "",
                executionTime: BigInt(proposalArgs.executionTime ?? 0),
                expirationTime: BigInt(proposalArgs.expirationEpoch ?? Math.floor(Date.now()) + 7*24*60*60*1000),
                extensions: EXTENSIONS,
                names,
                addresses,
                versions,
            }
        );

        this.approveProposal(tx, proposalArgs.key);
        const executable = this.executeProposal(tx, proposalArgs.key);

        return config.executeConfigDeps(tx, MULTISIG_GENERICS, { executable, account: multisig });
    }

    // mint(
    //     tx: Transaction,
    //     proposalArgs: ProposalArgs,
    //     actionsArgs: MintArgs,
    //     multisig: TransactionObjectInput = this.id,
    // ): TransactionResult {
    //     this.assertMultisig();
    //     this.assertKey(proposalArgs);

    //     currency.proposeMint(
    //         tx,
    //         actionsArgs.coinType,
    //         {
    //             multisig: this.id,
    //             key: proposalArgs.key,
    //             description: proposalArgs.description ?? "",
    //             executionTime: BigInt(proposalArgs.executionTime ?? 0),
    //             expirationEpoch: BigInt(proposalArgs.expirationEpoch ?? this.epoch + 7),
    //             amount: BigInt(actionsArgs.amount),
    //         }
    //     );

    //     this.approveProposal(tx, proposalArgs.key);
    //     const executable = this.executeProposal(tx, proposalArgs.key);

    //     return currency.executeMint(tx, actionsArgs.coinType, { executable, multisig });
    // }

    // burn(
    //     tx: Transaction,
    //     proposalArgs: ProposalArgs,
    //     actionsArgs: BurnArgs,
    // ): TransactionResult {
    //     this.assertMultisig();
    //     this.assertKey(proposalArgs);

    //     currency.proposeBurn(
    //         tx,
    //         actionsArgs.coinType,
    //         {
    //             multisig: this.id,
    //             key: proposalArgs.key,
    //             description: proposalArgs.description ?? "",
    //             executionTime: BigInt(proposalArgs.executionTime ?? 0),
    //             expirationEpoch: BigInt(proposalArgs.expirationEpoch ?? this.epoch + 7),
    //             coinId: actionsArgs.coinId,
    //             amount: BigInt(actionsArgs.amount),
    //         }
    //     );

    //     this.approveProposal(tx, proposalArgs.key);
    //     const executable = this.executeProposal(tx, proposalArgs.key);

    //     return currency.executeBurn(tx, actionsArgs.coinType, { executable, multisig: this.id, receiving: actionsArgs.coinId });
    // }

    // update(
    //     tx: Transaction,
    //     proposalArgs: ProposalArgs,
    //     actionsArgs: UpdateArgs,
    //     metadata: string, // CoinMetadata<CoinType> ID
    // ): TransactionResult {
    //     this.assertMultisig();
    //     this.assertKey(proposalArgs);

    //     currency.proposeUpdate(
    //         tx,
    //         actionsArgs.coinType,
    //         {
    //             multisig: this.id,
    //             key: proposalArgs.key,
    //             description: proposalArgs.description ?? "",
    //             executionTime: BigInt(proposalArgs.executionTime ?? 0),
    //             expirationEpoch: BigInt(proposalArgs.expirationEpoch ?? this.epoch + 7),
    //             mdName: actionsArgs.name,
    //             mdSymbol: actionsArgs.symbol,
    //             mdDescription: actionsArgs.description,
    //             mdIcon: actionsArgs.icon,
    //         }
    //     );

    //     this.approveProposal(tx, proposalArgs.key);
    //     const executable = this.executeProposal(tx, proposalArgs.key);

    //     return currency.executeUpdate(tx, actionsArgs.coinType, { executable, multisig: this.id, metadata });
    // }

    // take(
    // 	tx: Transaction,
    // 	args: TakeArgs,
    // ): TransactionResult {
    // 	this.assertMultisig();
    // 	this.assertKey(args);

    // 	kiosk.proposeTake(
    // 		tx,
    // 		{
    // 			multisig: this.id,
    // 			key: args.key,
    // 			description: args.description ?? "",
    // 			executionTime: BigInt(args.executionTime ?? 0),
    // 			expirationEpoch: BigInt(args.expirationEpoch ?? this.epoch + 7),
    // 			name: args.name,
    // 			nftIds: args.nftIds,
    // 			recipient: args.recipient,
    // 		}
    // 	);

    // 	this.approveProposal(tx, args.key);
    // 	const executable = this.executeProposal(tx, args.key);

    // 	return kiosk.executeTake(tx, { executable, multisig: this.id });
    // }

    // === Helpers ===

    assertMultisig() {
        if (this.id === "") {
            throw new Error("Multisig id is not set. Please fetch the multisig before calling this method.");
        }
    }

    assertKey(args: ProposalArgs) {
        if (!args.key) throw new Error("Key is required.");
    }

    // Factory function to create the appropriate proposal type
    async initProposalWithActions(
        client: SuiClient,
        outcome: Outcome,
        fields: ProposalFields
    ): Promise<Proposal> {
        switch ("0x" + fields.issuer.roleType) {
            // case `${ACCOUNT_ACTIONS}::config::ConfigRulesProposal`:
            //     return await ConfigRulesProposal.init(client, this.id, fields);
            case `${ACCOUNT_ACTIONS.V1}::config::ConfigDepsProposal`:
                return await ConfigDepsProposal.init(client, this.id, outcome, fields);
            case `${ACCOUNT_ACTIONS.V1}::currency::MintProposal`:
                return await MintProposal.init(client, this.id, outcome, fields);
            case `${ACCOUNT_ACTIONS.V1}::currency::BurnProposal`:
                return await BurnProposal.init(client, this.id, outcome, fields);
            case `${ACCOUNT_ACTIONS.V1}::currency::UpdateProposal`:
                return await UpdateProposal.init(client, this.id, outcome, fields);
            // ... other cases for different proposal types
            default:
                throw new Error(`Proposal type ${fields.issuer.roleType} not supported.`);
        }
    }
}
