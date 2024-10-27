"use client";
import { IstreamData } from "@/config/constants";
import { MdExpandMore } from "react-icons/md";
import { useAccount } from "wagmi";
import UseAnimations from "react-useanimations";
import activity from "react-useanimations/lib/activity";
import { calculateStreamRate, getCurrentStreamed, millisecondsToHours } from "@/lib";
import { useEffect, useState } from "react";
    // cancel pause, unpause, update
    // manage hooks
const Audio = () => {
  return (
    <>
      <span className="relative flex h-2 w-2 mr-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
    </>
  );
};

export default function Stream({ amount, duration }: Partial<IstreamData>) {
  const { address } = useAccount();
  const [streamRate, setStreamRate] = useState<number>(0);
  const [more, setMore] = useState(false)
  const a = calculateStreamRate('1000', '1')
  function simulateDecrease(amount: number, rate: number, elapsedSeconds: number): number {
    const remaining = amount - (rate * elapsedSeconds);
    return remaining > 0 ? remaining : 0;
  }

  useEffect(() => {
    if (amount && duration) {
      const rate = calculateStreamRate(amount.toString(), millisecondsToHours(duration));
      setStreamRate(rate);
    }
  }, [amount, duration]);

  return (
    <div className="border-2 border-paypalMidBlue p-3  rounded-lg font-[family-name:var(--font-geist-sans)]">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-4">
          <h1>Live steam</h1>
          <Audio />
        </div>
        <div className="flex items-center gap-2">
          <small>view more</small>
          <MdExpandMore 
          onClick={() => setMore(!more)}
          />
        </div>
      </div>
      <div className="flex items-center gap-5 p-2 justify-evenly">
        <h3 className="text-paypalBlue">
          from{" "}
          <span className="text-sm font-semibold text-PayPalCerulean">
            {address?.slice(0, 5) + "..." + address?.slice(8, 14)}
          </span>
        </h3>
        <UseAnimations animation={activity} size={56} color="#009cde" />
        <p>{}</p>
        <h3 className="text-paypalBlue">
          to{" "}
          <span className="text-sm font-semibold text-PayPalCerulean">
            {address?.slice(0, 5) + "..." + address?.slice(8, 14)}
          </span>
        </h3>
      </div>
      {more && (
        <div>additional Informations</div>
      )}
    </div>
  );
}
