import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { gnosis } from "viem/chains";

export function requirePrivateKey() {
  const pk = process.env.OPERATOR_PRIVATE_KEY;
  if (!pk?.startsWith("0x")) {
    console.error("Missing OPERATOR_PRIVATE_KEY (0x… hex).");
    process.exit(1);
  }
  return pk;
}

export function createCirclesRunner(privateKey = requirePrivateKey()) {
  const rpc = process.env.GNOSIS_RPC_URL ?? "https://rpc.gnosischain.com";
  const account = privateKeyToAccount(privateKey);

  const publicClient = createPublicClient({
    chain: gnosis,
    transport: http(rpc),
  });

  const walletClient = createWalletClient({
    account,
    chain: gnosis,
    transport: http(rpc),
  });

  const contractRunner = {
    address: account.address,
    publicClient,
    async init() {},
    async sendTransaction(txs) {
      let receipt;
      for (const tx of txs) {
        const hash = await walletClient.sendTransaction({
          account,
          chain: gnosis,
          to: tx.to,
          data: tx.data,
          value: tx.value ?? 0n,
        });
        receipt = await publicClient.waitForTransactionReceipt({ hash });
        if (receipt.status !== "success") {
          throw new Error(`Transaction reverted: ${hash}`);
        }
      }
      return receipt;
    },
  };

  return { account, rpc, contractRunner };
}

export function histToAtto(amount) {
  return BigInt(Math.round(Number(amount) * 1e18));
}
