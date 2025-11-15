import { useContext } from 'react'
import { ColorModeContext } from './ColorModeContext'

export const useColorMode = () => useContext(ColorModeContext)