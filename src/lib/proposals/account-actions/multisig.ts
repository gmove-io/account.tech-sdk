import { Transaction, TransactionObjectInput, TransactionResult } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import * as multisig from "../../../.gen/account-config/multisig/functions";
import { Proposal } from "../proposal";
import { ConfigMultisigArgs, ProposalArgs, ProposalFields } from "src/types/proposal-types";
import { Outcome } from "../outcome";

export class ConfigMultisigProposal extends Proposal {

    static async init(
        client: SuiClient,
        multisig: string,
        outcome: Outcome,
        fields: ProposalFields,
    ): Promise<ConfigMultisigProposal> {
        const proposal = new ConfigMultisigProposal(client, multisig, outcome, fields);
        // resolve actions
        const actions = await proposal.fetchActions(fields.actionsId);
        if (actions.length === 0) {
            throw new Error('No actions found for the ConfigRules proposal');
        }

        proposal.args = {
            members: actions[0].inner,
            thresholds: actions[1].inner,
        };
        return proposal;
    }

    propose(
        tx: Transaction,
        auth: TransactionObjectInput,
        outcome: TransactionObjectInput,
        account: string,
        _accountGenerics: [string, string],
        proposalArgs: ProposalArgs,
        actionArgs: ConfigMultisigArgs,
    ): TransactionResult {
        let addresses: string[] = [];
        let weights: bigint[] = [];
        let roles: string[][] = [];
        if (actionArgs.members) {
            actionArgs.members.forEach((member) => {
                addresses.push(member.address);
                weights.push(BigInt(member.weight));
                roles.push(member.roles);
            });
        }

        let global = 0n;
        let roleNames: string[] = [];
        let roleThresholds: bigint[] = [];
        if (actionArgs.thresholds) {
            global = BigInt(actionArgs.thresholds.global);
            actionArgs.thresholds.roles.forEach((role) => {
                roleNames.push(role.name);
                roleThresholds.push(BigInt(role.threshold));
            });
        }

        return multisig.proposeConfigMultisig(
            tx,
            {
                auth,
                account,
                outcome,
                key: proposalArgs.key,
                description: proposalArgs.description ?? "",
                executionTime: BigInt(proposalArgs.executionTime ?? 0),
                expirationTime: BigInt(proposalArgs.expirationTime ?? Math.floor(Date.now()) + 7 * 24 * 60 * 60 * 1000),
                addresses,
                weights,
                roles,
                global,
                roleNames,
                roleThresholds,
            }
        );
    }

    execute(
        tx: Transaction,
        executable: TransactionObjectInput,
    ): TransactionResult {
        return multisig.executeConfigMultisig(
            tx,
            {
                executable,
                account: this.account,
            }
        );
    }
}