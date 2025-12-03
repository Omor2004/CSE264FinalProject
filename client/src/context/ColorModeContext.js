import { createContext } from 'react'

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'dark'
})

//NOTE: this file is only importing the context object, I separate the provider into its own file ColorModeContext.jsx to avoid circular dependencies!
