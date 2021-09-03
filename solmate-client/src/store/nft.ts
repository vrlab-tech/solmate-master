import create from 'zustand'
import { devtools } from 'zustand/middleware'
interface NFTStore{
    generated: File
    setGeneratedFile:(file:File)=>void
}
export const useNftStore = create<NFTStore>(
    devtools((set) => ({
        generated:null,
        setGeneratedFile:(file:File)=>set(()=>({generated:file}))
    }))
)