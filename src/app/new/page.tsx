"use client"
import Image from "next/image";
import StreamingPaymentCard from "../_components/StreamingPaymentCard"
import img from '../../static/abstract.jpeg'

export default function New() {
  return (
    <div className="flex w-[95%] mx-auto border border-paypalMidBlue/20 h-screen rounded-xl">
      <section className="flex w-full h-full">
        {/* Left side - Form */}
        <div className="w-1/2 p-8 lg:p-16 flex items-center justify-center bg-transparent">
          <div className="w-full max-w-md">
            <StreamingPaymentCard />
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block w-1/2 relative rounded-lg">
          <Image 
            src={img} 
            alt="abstract_image" 
            fill
            className="object-cover rounded-xl"
            priority
            quality={100}
          />
        </div>
      </section>
    </div>
  );
}