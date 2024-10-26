"use client"

import { useState } from "react"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useWriteContract } from "wagmi"
import { useAccount } from "wagmi" 
import { isAddress } from 'viem'
import axios from 'axios'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CiStreamOn } from "react-icons/ci";
import { DateTimePicker } from "./TimePicker"
type CardProps = React.ComponentProps<typeof Card>

export default function StreamingPaymentCard({ className, ...props }: CardProps) {
  const account = useAccount()
  const { writeContract } = useWriteContract()

  const [amount, setAmount] = useState("")
  const [duration, setDuration] = useState("")
  const [receiver, setReceiver] = useState("")
  const [avalaibles, setAvaibilties] = useState<Date[]>([]);
  const [streamTag, setStreamTag] = useState<string>('')

  async function initateNewStream() {
    try {
      // pass the values on the database
      // call the newStream function 
      const res = await axios.post('/api/streams/new', {
        streamer : account.address,
        recipient : receiver, 
        token_Address : '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9', // PYSUD ADDRESS
        tag:  streamTag
      })
      if(res.data) {
        // const contractCall  = writeContract({
        //   abi : streamAbi,
        //   address : '', 
        //   functionName  : 'createStream', 
        //   args: [

        //   ]
        // })
      }

    } catch (error: any) {
      console.log('error', {error})
    }
  }

  return (
    <Card className={cn("w-[500px] shadow-none border-none ", className)} {...props}>
      <CardHeader>
        <CardTitle className="text-3xl text-PayPalCerulean flex items-center gap-2">Stream Payment <CiStreamOn />
        </CardTitle>
        <CardDescription className="text-lg text-paypalMidBlue">Set up your streaming payment details.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="amount" className='text-lg font-[family-name:var(--font-geist-sans)]'>Total Amount</Label>
          <Input
            id="amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="duration" className='text-lg font-[family-name:var(--font-geist-sans)]'>Duration (in hours)</Label>
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
            setAvaibilties((previous) => [...previous, date]);
          }}
        />         

        </div>
        <div className="grid gap-2">
          <Label htmlFor="tag" className='text-lg font-[family-name:var(--font-geist-sans)]'>Stream Tag</Label>
          <Input
            id="tag"
            placeholder="Enter unique streaming TAG"
            value={streamTag}
            onChange={(e) => setStreamTag(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="receiver" className='text-lg font-[family-name:var(--font-geist-sans)]'>Receiver Address</Label>
          <Input
            id="receiver"
            placeholder="Enter receiver's address"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-paypalBlue ont-[family-name:var(--font-geist-sans)] p-6 py-8 rounded-xl hover:bg-PayPalCerulean shadow-md text-lg">
         Start Streaming  <ArrowRightIcon className="mr-2 h-4 w-4" /> 
        </Button>
      </CardFooter>
    </Card>
  )
}