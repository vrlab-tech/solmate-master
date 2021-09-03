import create from 'zustand'
import { devtools } from 'zustand/middleware'
interface NFTStore{
    generated: File
    setGeneratedFile: (file: File) => void
    idnft: string
    setIdNft:(id:string)=>void
}
export const useNftStore = create<NFTStore>(
    devtools((set) => ({
        generated: null,
        idnft:'',
        setGeneratedFile: (file: File) => set(() => ({ generated: file })),
        setIdNft:(id:string)=>set(()=>({idnft:id}))
    }))
)