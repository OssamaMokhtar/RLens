import { useContext } from 'react'
import PulseContext from '../context/PulseContext'

export function usePulse() {
  return useContext(PulseContext)
}
