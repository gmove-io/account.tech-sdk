import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Transaction, TransactionResult } from "@mysten/sui/transactions";
import { KioskClient, Network } from "@mysten/kiosk";
import { KRAKEN_MULTISIG, ProposalTypes } from "./types/constants.js";
import { Dep, Kiosk, Member, TransferPolicy } from "./types/multisigTypes.js";
import { Account } from "./lib/account.js";
import { Multisig } from "./lib/multisig.js";
import { TransactionPureInput } from "./types/helperTypes.js";
import { getObjectId } from "./lib/utils.js";
import { ConfigDepsProposal, ConfigNameProposal, ConfigRulesProposal } from "./lib/proposal/proposals/config.js";
import { ProposalArgs } from "./types/proposalTypes.js";
import { Proposal } from "./lib/proposal/proposal.js";

const proposalRegistry: Record<string, typeof Proposal> = {
    [ProposalTypes.configName]: ConfigNameProposal,
    [ProposalTypes.configRules]: ConfigRulesProposal,
    [ProposalTypes.configDeps]: ConfigDepsProposal,
};

export class KrakenClient {
	/**
	 * @description SDK to interact with Kraken package.
	 * @param client connection to fullnode
	 */

	public client: SuiClient;
	public account: Account;
	public multisig: Multisig;

	private constructor(
		public network: "mainnet" | "testnet" | "devnet" | "localnet" | string,
	) {
		const url = (network == "mainnet" || network == "testnet" || network == "devnet" || network == "localnet") ? getFullnodeUrl(network) : network;
		this.client = new SuiClient({ url });
		this.account = new Account(this.client, "");
		this.multisig = new Multisig(this.client, "");
	}
	
	static async init(
        network: "mainnet" | "testnet" | "devnet" | "localnet" | string,
        userAddr: string, 
		multisigId?: string,
    ): Promise<KrakenClient> {
		const kraken = new KrakenClient(network);
		kraken.account = await Account.init(kraken.client, userAddr);
		kraken.multisig = await Multisig.init(kraken.client, userAddr, multisigId);
		return kraken;
	}

	async refreshAccount(address: string = this.account.userAddr) {
		let account = await this.account.fetchAccount(address);
		this.account.setAccount(account);
	}

	async refreshMultisig(address: string = this.multisig.id) {
		let multisig = await this.multisig.fetchMultisig(address);
		this.multisig.setMultisig(multisig);
	}

	// creates a multisig with default weights of 1 (1 member = 1 voice)
	createMultisig(
		tx: Transaction, 
		name: string,
		newAccount?: { username: string, profilePicture: string },
		memberAddresses?: string[],
		deps?: Dep[],
	): TransactionResult {
		// create the account if the user doesn't have one
		let accountId: TransactionPureInput = this.account.id;
		let createdAccount: TransactionPureInput | null = null;
		if (accountId === "") {
			if (!newAccount) throw new Error("User must create an account before creating a multisig");
			createdAccount = this.account.createAccount(tx, newAccount.username, newAccount.profilePicture);
			accountId = getObjectId(tx, createdAccount, `${KRAKEN_MULTISIG}::account::Account`);
		}
		// create the multisig
		const multisig = this.multisig?.newMultisig(tx, name, accountId);
		// update multisig rules if members are provided
		if (memberAddresses) {
			const members = memberAddresses.map((address: string) => ({ address, weight: 1, roles: [] }));
			this.multisig.configRules(tx, { key: "init_members" }, { members }); // atomic proposal
		}
		// update multisig deps if provided
		if (deps) {
			this.multisig.configDeps(tx, { key: "init_deps" }, { deps }); // atomic proposal
		}
		// creator register the multisig in his account
		this.account.joinMultisig(tx, createdAccount ? createdAccount : accountId, multisig);
		// send invites to added members
		memberAddresses?.forEach(address => { this.account?.sendInvite(tx, multisig, address) });
		// transfer the account if just created
		if (createdAccount) this.account.transferAccount(tx, createdAccount, this.account.userAddr);
		// share the multisig
		return this.multisig?.shareMultisig(tx, multisig);
	}

	// Factory function to call the appropriate propose function
	propose(
		tx: Transaction,
		proposalType: ProposalTypes,
		proposalArgs: ProposalArgs,
		...actionsArgs: any[]
	) {
		const proposalClass = proposalRegistry[proposalType];
		const method = proposalClass.prototype.propose;
		method.call(proposalClass, tx, this.multisig.id, proposalArgs, ...actionsArgs);
		// directly approve after proposing
		this.multisig.approveProposal(tx, proposalArgs.key, this.multisig.id);
	}

	// calls the execute function for the proposal
	execute(
		tx: Transaction,
		caller: string,
		proposalKey: string,
		...actionsArgs: any[]
	) {
		const proposal = this.proposal(proposalKey);
		proposal?.maybeApprove(tx, caller);
		proposal?.execute(tx, ...actionsArgs);
	}

	// === Helpers ===

	proposal(key: string): Proposal | undefined {
		return this.multisig?.getProposal(key);
	}

	hasApproved(key: string, userAddr: string = this.account.userAddr): boolean {
		const has = this.proposal(key)?.approved?.includes(userAddr);
		if (!has) throw new Error("Proposal not found");
		return has;
	}
}

