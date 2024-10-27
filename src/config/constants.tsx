import { Hex } from "viem";
export const CONTRACT_ADDRESS = "0xD0478f1E35C3fa992112b1696aC434D1afB12411";
export const PYUSD  = "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9"
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
