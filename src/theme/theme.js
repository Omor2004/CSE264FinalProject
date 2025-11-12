//#ffba08
//#faa307
//#f48c06
//#e85d04
//#dc2f02
//#d00000
//#9d0208
//#9d0208
//#370617
//#03071e 

import { createTheme } from '@mui/material'

const theme = createTheme({
    palette: {
        primary: {
            main: '#e85d04',
        }
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.palette.primary.main,
                    boxShadow: 'none'
                }),
            },
        },
    },
})

export default theme