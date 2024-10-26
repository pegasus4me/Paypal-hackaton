"use client"
import Image from "next/image";
import StreamingPaymentCard from "../_components/StreamingPaymentCard"
import img from '../../static/abstract.jpeg'

export default function New() {
  return (
    <div className="flex w-[95%] mx-auto border border-paypalMidBlue/20 mt-20 rounded-xl items-center justify-center">
        <div className="flex items-center justify-center bg-transparent">
          <div className="">
            <StreamingPaymentCard />
          </div>
        </div>
    </div>
  );
}