"use client";

import { useCallback, useEffect, useState } from "react";
import { StreamWithHash } from "../new/manage/page";
import { useWriteContract } from "wagmi";
import { useReadContract } from "wagmi";
import { MdExpandMore } from "react-icons/md";
import { ContractAbi } from "@/config/ABI/contractABI";
import { CONTRACT_ADDRESS } from "@/config/constants";
import UseAnimations from "react-useanimations";
import activity from "react-useanimations/lib/activity";
import { IoRefresh } from "react-icons/io5"
import { Hex } from "viem";
import { Button } from "@/components/ui/button";

const REFRESH_INTERVAL = 1000; // Update every second

export function Receive({
  amount,
  duration,
  recipient,
  streamer,
  hash,
  lenght,
  startingTimestamp,
}: Partial<StreamWithHash>) {
  const now = Date.now();
  const { data, writeContract } = useWriteContract();
  const [streamRate, setStreamRate] = useState<number>(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [more, setMore] = useState(false);
  console.log("startingTimestamp", startingTimestamp)
  const difference = Number(startingTimestamp) < Number(now);

  const collectPYUSD = () => {
    writeContract({
      abi: ContractAbi,
      address: CONTRACT_ADDRESS,
      functionName: "collectFundsFromStream",
      args: [hash as Hex],
    });
  };
  // Calculate stream rate once when component mounts
  const amountStreamedSoFar = useReadContract({
    abi: ContractAbi,
    address: CONTRACT_ADDRESS,
    functionName: "getAmountToCollectFromStreamAndFeeToPay",
    args: [hash as Hex],
  });

  console.log("amountStreamedSoFar", amountStreamedSoFar.data);
  useEffect(() => {
    if (amount && duration) {
      const ratePerSecond = Number(amount) / (Number(duration) / 1000);
      setStreamRate(ratePerSecond);
      setCurrentValue(Number(amount));
    }
  }, [amount, duration]);

  // Update current value periodically
  const updateCurrentValue = useCallback(() => {
    if (!startingTimestamp || !amount) return;

    const now = Date.now();
    const start = Number(startingTimestamp) * 1000;
    const total = Number(amount);
    const elapsed = now - start;

    // Check if stream has finished
    if (duration && elapsed >= Number(duration)) {
      setCurrentValue(0);
      return;
    }

    // Calculate remaining amount
    const streamed = streamRate * (elapsed / 1000);
    const remaining = total - streamed;

    setCurrentValue(Math.max(0, remaining));
  }, [startingTimestamp, amount, duration, streamRate]);

  useEffect(() => {
    // Initial update
    updateCurrentValue();

    // Set up interval for continuous updates
    const intervalId = setInterval(updateCurrentValue, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [updateCurrentValue]);

  // Format the current value for display
  const formattedValue = currentValue.toFixed(3);
  return (
    <div>
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-4">
          <h1>
            {difference ? "Live income stream" : "upcoming income stream"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <small>view more</small>
          <MdExpandMore onClick={() => setMore(!more)} />
        </div>
      </div>
      <div className="flex items-center gap-10 p-2 justify-start ">
        <div className="flex flex-col p-3">
          <p className="font-medium text-paypalMidBlue">
            {formattedValue} <span className="text-italic">PYUSD</span> streamed
          </p>
          <h3 className="text-paypalBlue">
            from{" "}
            <span className="text-sm font-semibold text-PayPalCerulean">
              {streamer?.slice(0, 5) + "..." + streamer?.slice(38, 42)}
            </span>
          </h3>
        </div>
        <UseAnimations animation={activity} size={40} color="#009cde" />
        <h3 className="text-paypalBlue">
          to{" "}
          <span className="text-sm font-semibold text-PayPalCerulean">
            {recipient?.slice(0, 5) + "..." + recipient?.slice(38, 42)} (you)
          </span>
        </h3>
      </div>
      {more && (
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Stream Rate</p>
              <p className="font-medium">
                {streamRate.toFixed(6)} PYUSD/second
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Duration</p>
              <p className="font-medium">
                {(Number(duration) / (1000 * 60 * 60)).toFixed(2)} hours
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Start Time</p>
              <p className="font-medium">
                {new Date(Number(startingTimestamp) * 1000).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">PYUSD Clamaible so far</p>
             <div className="flex items-center gap-3">
             <p className="font-medium">2 / <span className="text-PayPalCerulean">{Number(amount)} PYUSD</span></p>
             <IoRefresh onClick={() => amountStreamedSoFar} className="cursor-pointer" />
             </div>
              <div className="mt-4">
                <Button
                  className="border px-4 py-3 rounded-lg bg-paypalMidBlue text-white hover:bg-paypalBlue hover:transition-all"
                  onClick={() => collectPYUSD()}
                >
                  Collect PYUSD
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Time</p>
              <p className="font-medium">
                {new Date(
                  Number(startingTimestamp) * 1000 + Number(duration)
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
