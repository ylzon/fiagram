import { createContext } from 'react'
import type { Size } from '../hooks/ahooks/useSize.tsx'

interface GlobalContextValue {
  width: Size['width']
  height: Size['height']
}

export const GlobalContext = createContext<GlobalContextValue>({
  width: 0,
  height: 0,
})
