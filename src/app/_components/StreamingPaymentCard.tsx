"use client"

import { useState } from "react"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

type CardProps = React.ComponentProps<typeof Card>

export default function StreamingPaymentCard({ className, ...props }: CardProps) {
  const [amount, setAmount] = useState("")
  const [duration, setDuration] = useState("")
  const [receiver, setReceiver] = useState("")

  return (
    <Card className={cn("w-[500px] shadow-none border-none ", className)} {...props}>
      <CardHeader>
        <CardTitle className="text-3xl text-PayPalCerulean flex items-center gap-2">Stream Payment <CiStreamOn />
        </CardTitle>
        <CardDescription className="text-lg text-paypalMidBlue">Set up your streaming payment details.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="amount">Total Amount</Label>
          <Input
            id="amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="duration">Duration (in hours)</Label>
          <Input
            id="duration"
            className="p-6"
            placeholder="Enter duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="receiver">Receiver Address</Label>
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