export async function subscribeWallet(
  onAddress: (address: string | null) => void,
): Promise<{ unsubscribe: () => void; isMiniappHost: boolean }> {
  const { onWalletChange, isMiniappMode } = await import(
    "@aboutcircles/miniapp-sdk"
  );
  const unsubscribe = onWalletChange(onAddress);
  return { unsubscribe, isMiniappHost: isMiniappMode() };
}

export async function signInMessage(nonce: string): Promise<{
  signature: string;
  verified: boolean;
}> {
  const { signMessage } = await import("@aboutcircles/miniapp-sdk");
  return signMessage(`Sign in to History Guessr\nNonce: ${nonce}`, "erc1271");
}
