import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { MultisigClient } from "../../src/multisig-client";

(async () => {
    const keypair = Ed25519Keypair.fromSecretKey(Uint8Array.from(Buffer.from("AM06bExREdFceWiExfSacTJ+64AQtFl7SRkSiTmAqh6F", "base64")).slice(1));    
    const ms = await MultisigClient.init(
        "testnet",
        keypair.toSuiAddress(),
    );

    const tx = new Transaction();
    tx.setGasBudget(1000000000);

    ms.createMultisig(tx, "Thouny's Multisig")
    
    const result = await ms.client.signAndExecuteTransaction({
        signer: keypair,
        transaction: tx,
        options: { showEffects: true, showObjectChanges: true },
        requestType: "WaitForLocalExecution"
    });

    if (result.effects?.status.status != "success") {
        console.log(result.effects?.status.error);
    }

    console.log(result.effects?.status.status);
    console.log(result.effects?.created);
})();