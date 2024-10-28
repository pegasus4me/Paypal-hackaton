"use client";
import { CONTRACT_ADDRESS, IstreamData } from "@/config/constants";
import { MdExpandMore } from "react-icons/md";
import { useWriteContract } from "wagmi";
import UseAnimations from "react-useanimations";
import activity from "react-useanimations/lib/activity";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ContractAbi } from "@/config/ABI/contractABI";
// import {
//   calculateStreamRate,
//   getCurrentStreamed,
//   millisecondsToHours,
// } from "@/lib";
import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DateTimePicker } from "./TimePicker";
import { Hex } from "viem";

const REFRESH_INTERVAL = 1000; // Update every second

// cancel update
// manage hooks
const Audio = ({ started }: { started: boolean }) => {
  return (
    <>
      <span className="relative flex h-2 w-2 mr-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            started ? "bg-green-500" : "bg-blue-500"
          }`}
        />
      </span>
    </>
  );
};


interface StreamWithHash extends IstreamData {
  hash: Hex;
}
export default function Stream({
  amount,
  duration,
  recipient,
  streamer,
  hash,
  startingTimestamp,
}: Partial<StreamWithHash>) {
  const now = Date.now();
  const { data, writeContract } = useWriteContract();
  const [streamRate, setStreamRate] = useState<number>(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [more, setMore] = useState(false);
  const difference = Number(startingTimestamp) < Number(now);


  // updates
  const [newAmount, setNewAmount] = useState("");
  const [newStartingDate, seNewStartingDate] = useState<Date>();
  const [newDuration, setNewDuration] = useState("");
  const [recurring, setRecurring] = useState(false);

  const updateStream = () => {
    writeContract({
      abi: ContractAbi, 
      address : CONTRACT_ADDRESS,
      functionName : 'updateStream', 
      args:  [
        hash as Hex,
        BigInt(Number(newAmount)),
        BigInt(Math.floor(new Date(newStartingDate as Date).getTime() / 1000)),
        BigInt(Number(newDuration) * 60 * 60 * 1000),
        recurring
      ]
    })
  }
  const cancelStream = () => {
    writeContract({
      abi: ContractAbi, 
      address : CONTRACT_ADDRESS,
      functionName : 'cancelStream', 
      args:  [hash as Hex]
    })
  }
  // Calculate stream rate once when component mounts
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
    <div className="border-2 border-paypalMidBlue p-3  rounded-[10px] font-[family-name:var(--font-geist-sans)]">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-4">
          <h1>{difference ? "Live stream" : "upcoming stream"}</h1>
          <Audio started={difference} />
        </div>
        <div className="flex items-center gap-2">
          <small>view more</small>
          <MdExpandMore onClick={() => setMore(!more)} />
        </div>
      </div>
      <div className="flex items-center gap-5 p-2 justify-evenly">
        <h3 className="text-paypalBlue">
          from{" "}
          <span className="text-sm font-semibold text-PayPalCerulean">
            {streamer?.slice(0, 5) + "..." + streamer?.slice(38, 42)}
          </span>
        </h3>
        <div className="flex gap-7 justify-center items-center">
          <UseAnimations animation={activity} size={40} color="#009cde" />
          <p className="font-medium text-paypalMidBlue">
            {formattedValue} <span className="text-italic">PYUSD</span>
          </p>
          <UseAnimations animation={activity} size={40} color="white" />
        </div>
        <h3 className="text-paypalBlue">
          to{" "}
          <span className="text-sm font-semibold text-PayPalCerulean">
            {recipient?.slice(0, 5) + "..." + recipient?.slice(38, 42)}
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
              <p className="text-sm text-gray-500">End Time</p>
              <p className="font-medium">
                {new Date(
                  Number(startingTimestamp) * 1000 + Number(duration)
                ).toLocaleString()}
              </p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger className="mt-5 border px-4 py-2 rounded-lg bg-PayPalCerulean text-white hover:bg-paypalBlue hover:transition-all">
              Update current stream
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update</DialogTitle>
                <DialogDescription className="mb-5">
                  This action will update your current stream details
                </DialogDescription>

                <Label htmlFor="newAmount" className="text-left">
                  New Amount
                </Label>
                <Input
                  placeholder={String(amount)}
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="col-span-3"
                />

                <Label htmlFor="newStartingDate" className="text-left mt-4">
                  New Starting Date
                </Label>
                <DateTimePicker
                  date={new Date()}
                  setDate={(date: Date) => {
                    seNewStartingDate(date);
                  }}
                />

                <Label htmlFor="newDuration" className="text-left mt-4">
                  New Duration (in hours)
                </Label>
                <Input
                  placeholder="e.g, 24"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="col-span-3"
                />

               <div className="flex items-center justify-between mt-4">
               <Label htmlFor="recurring" className="text-left">
                  Set as Recurring
                </Label>
                <input
                  type="checkbox"
                  checked={recurring}
                  onChange={(e) => setRecurring(e.target.checked)}
                  className=""
                />
               </div>
               <Button className="bg-paypalMidBlue mt-5 shadow-none"
               onClick={updateStream}
               >update</Button>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <div className="mt-4">
          <Button className="border px-4 py-3 rounded-lg bg-paypalMidBlue text-white hover:bg-paypalBlue hover:transition-all"
               onClick={cancelStream}
          >Cancel Stream</Button>
          </div>
        </div>
      )}
    </div>
  );
}
