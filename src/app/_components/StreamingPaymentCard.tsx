"use client";

import { useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import { erc20Abi, Hex, isAddress } from "viem";
import { useApprouve } from "@/hooks/useApprouve";
import { CONTRACT_ADDRESS } from "@/config/constants";
import { ContractAbi } from "@/config/ABI/contractABI";
import { IstreamData, IHookConfig } from "@/config/constants";
import { PYUSD } from "@/config/constants";
import usePyUSD from "@/hooks/usePyBalance";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CiStreamOn } from "react-icons/ci";
import { DateTimePicker } from "./TimePicker";
type CardProps = React.ComponentProps<typeof Card>;

export default function StreamingPaymentCard({
  className,
  ...props
}: CardProps) {
  const account = useAccount();
  const { data, isError, isLoading, isSuccess, writeContract } =
    useWriteContract();
  const checkBalance = usePyUSD(account.address as Hex);
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [receiver, setReceiver] = useState("");
  const [error, setError] = useState(false);
  // const approuve = useApprouve(CONTRACT_ADDRESS, BigInt(amount))
  const [startingDate, setStartingDate] = useState<Date>();
  const [streamTag, setStreamTag] = useState<string>("");

  async function InitateNewStream() {
    try {
      // call the newStream function
      // getStreamHashes()
      // getStreamData()
      const StreamData: IstreamData = {
        streamer: account.address as Hex,
        streamerVault: "0x0000000000000000000000000000000000000000" as Hex,
        recipient: receiver as Hex,
        recipientVault: "0x0000000000000000000000000000000000000000" as Hex,
        token: PYUSD,
        amount: BigInt(amount), // maybe here the amount will be 0.001 because of 6 decimals
        startingTimestamp: BigInt(
          Date.parse(startingDate?.toString() as string)
        ),
        duration: BigInt(Number(duration) * 60 * 60 * 1000),
        isPaused: false,
        recurring: false,
        totalStreamed: 0n,
      };
      const HookData: IHookConfig = {
        callAfterStreamCreated: false,
        callBeforeFundsCollected: false,
        callAfterFundsCollected: false,
        callBeforeStreamUpdated: false,
        callAfterStreamUpdated: false,
        callBeforeStreamClosed: false,
        callAfterStreamClosed: false,
        callBeforeStreamPaused: false,
        callAfterStreamPaused: false,
        callBeforeStreamUnPaused: false,
        callAfterStreamUnPaused: false,
      };

      const contractCall = writeContract({
        abi: ContractAbi,
        address: CONTRACT_ADDRESS,
        functionName: "setStream",
        args: [StreamData, HookData, streamTag],
      });
    } catch (error) {
      console.log("error", { error });
    }
  }

  return (
    <Card
      className={cn("w-[500px] shadow-none border-none ", className)}
      {...props}
    >
      <CardHeader>
        <CardTitle className="text-3xl text-PayPalCerulean flex items-center gap-2">
          Stream Payment <CiStreamOn />
        </CardTitle>
        <CardDescription className="text-lg text-paypalMidBlue">
          Set up your streaming payment details.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label
            htmlFor="amount"
            className="text-lg font-[family-name:var(--font-geist-sans)]"
          >
            Total Amount
          </Label>
          <Input
            id="amount"
            className={`${error && "border-2 border-red-500"} `}
            placeholder="Enter amount"
            value={amount}
            onChange={(e) =>
              Number(e.target.value) > Number(checkBalance) / 1_000_000
                ? setError(!error)
                : setAmount(e.target.value)
            }
          />
          <small className="text-end font-semibold text-neutral-200 hover:text-paypalMidBlue hover:transition-all">
            max {(Number(checkBalance) / 1_000_000).toLocaleString()} PYUSD
          </small>
        </div>
        <div className="grid gap-2">
          <Label
            htmlFor="duration"
            className="text-lg font-[family-name:var(--font-geist-sans)]"
          >
            Duration (in hours)
          </Label>
          <Input
            id="duration"
            className="p-6"
            placeholder="Enter duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <DateTimePicker
            date={new Date()}
            setDate={(date: Date) => {
              setStartingDate(date);
            }}
          />
        </div>
        <div className="grid gap-2">
          <Label
            htmlFor="tag"
            className="text-lg font-[family-name:var(--font-geist-sans)]"
          >
            Stream Tag
          </Label>
          <Input
            id="tag"
            placeholder="Enter unique streaming TAG"
            value={streamTag}
            onChange={(e) => setStreamTag(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label
            htmlFor="receiver"
            className="text-lg font-[family-name:var(--font-geist-sans)]"
          >
            Receiver Address
          </Label>
          <Input
            id="receiver"
            placeholder="Enter receiver's address"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="gap-4">
        <Button
          className="w-full bg-PayPalCerulean ont-[family-name:var(--font-geist-sans)] p-6 py-8 rounded-xl hover:bg-PayPalCerulean shadow-md text-lg"
          onClick={() => {
            writeContract({
              abi: erc20Abi,
              address: PYUSD,
              functionName: "approve",
              args: [CONTRACT_ADDRESS, BigInt(amount)],
            })
          }}
          disabled={isLoading} 
        >
          {isLoading
            ? "Approving..."
            : isSuccess
            ? "Approved!"
            : isError
            ? "Error"
            : "Approve PYUSD"}
        </Button>
          <Button
            className="w-full bg-paypalBlue ont-[family-name:var(--font-geist-sans)] p-6 py-8 rounded-xl hover:bg-PayPalCerulean shadow-md text-lg"
            onClick={InitateNewStream}
          >
            Start Streaming <ArrowRightIcon className="mr-2 h-4 w-4" />
          </Button>
      </CardFooter>
    </Card>
  );
}
