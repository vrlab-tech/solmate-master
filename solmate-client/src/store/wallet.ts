import create from 'zustand'
import { devtools } from 'zustand/middleware'
interface WalletStore{
    publicAddress: string | undefined
    setPublicAddress:(address:string|undefined)=>void
}
export const useWalletStore = create<WalletStore>(
    devtools((set) => ({
        publicAddress: "",
        setPublicAddress:(address:string|undefined)=> set(()=>({publicAddress:address}))
    }))
)