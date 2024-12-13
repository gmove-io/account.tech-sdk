import { Proposal } from "src/lib/proposals/proposal";

export enum AccountType {
    MULTISIG = "multisig",
    DAO = "dao",
}

export type Dep = {
    name: string,
    addr: string,
    version: number,
}

export type Kiosk = {
    cap: string,
    kiosk: string,
    profits: bigint,
    itemCount: number,
}

export type TransferPolicy = {
    id: string,
    hasFloorPrice: boolean,
    hasRoyalty: boolean,
    isLocked: boolean,
}

// === Multisig ===

export interface MultisigData {
    id: string;
    metadata: { key: string, value: string }[];
    deps: Dep[];
    global: Role;
    roles: Map<string, Role>;
    members: MemberUser[];
    proposals: Proposal[];
}

export type Role = {
    threshold: number,
    totalWeight: number,
}

export type Threshold = {
    name: string,
    threshold: number,
}

export type Member = {
    address: string,
    weight: number,
    roles: string[],
};

export type MemberUser = {
    address: string,
    accountId: string,
    username: string,
    avatar: string,
    weight: number,
    roles: string[],
};