import { useMemo } from "react"
import { erc20Abi } from "viem"
import { useReadContract } from "wagmi"
import { Hex } from "viem"

export default function usePyUSD(address : Hex) {
    
    const balance = useReadContract({
        abi :erc20Abi,
        address: '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9' as Hex,
        functionName : 'balanceOf',
        args : [address]
    })
    return useMemo(() => balance.data,[balance.data])
    
}