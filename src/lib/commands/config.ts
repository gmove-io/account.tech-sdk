import { editMetadata } from "src/.gen/account-actions/config/functions";
import { Transaction, TransactionObjectInput, TransactionResult } from "@mysten/sui/transactions";

/// Replaces the metadata of an account, first element must be "name"
export function replaceMetadata(
    tx: Transaction,
    accountGenerics: [string, string],
    auth: TransactionObjectInput,
    account: string,
    keys: string[],
    values: string[],
): TransactionResult {
    if (keys[0] !== "name") throw new Error("'name' must be the first key in metadata");

    return editMetadata(
        tx,
        accountGenerics,
        { auth, account, keys, values },
    );
}