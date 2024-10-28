import { Hex } from "viem";
export const CONTRACT_ADDRESS = "0x6C95f2dB17e6a07ed8f5a7a27A5410088C1dE43A" as Hex;
export const PYUSD  = "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9" as Hex
export interface IstreamData {
  streamer: Hex;
  streamerVault: Hex;
  recipient: Hex;
  recipientVault: Hex;
  token: Hex;
  amount: bigint;
  startingTimestamp: bigint;
  duration: bigint;
  totalStreamed: bigint;
  recurring: boolean;
  isPaused: boolean;
  // methods
  updateStream?: () => void
  cancelStream?: () => void
  // for receiver
  collectFundsFromStream?: () => void
  // Add Hooks to currentStream
  setHookConfigForStream?: () => void
}

export interface IHookConfig {
  callAfterStreamCreated: boolean;
  callBeforeFundsCollected: boolean;
  callAfterFundsCollected: boolean;
  callBeforeStreamUpdated: boolean;
  callAfterStreamUpdated: boolean;
  callBeforeStreamClosed: boolean;
  callAfterStreamClosed: boolean;
  callBeforeStreamPaused: boolean;
  callAfterStreamPaused: boolean;
  callBeforeStreamUnPaused: boolean;
  callAfterStreamUnPaused: boolean;
}
