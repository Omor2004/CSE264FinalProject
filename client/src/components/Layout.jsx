
import { Link, Outlet } from 'react-router-dom'
import { AppBar, CssBaseline, Toolbar, Typography, Box, Button, Container, ThemeProvider } from "@mui/material"
import {Home as HomeIcon} from '@mui/icons-material'

import theme from '../theme/theme'

const Layout = () => {

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
        <CssBaseline/>
        <AppBar position='sticky'>
          <Toolbar>
            <Typography
              variant='h6'
              component={Link}
              to='/'
              onClick={'/'}
              sx={{ flexGrow: 1, fontWeight: 700, textDecoration: 'none', color: 'white' }}
            >

            </Typography>

            <Button color='inherit' component={Link} to='/' onClick={'/'} startIcon={<HomeIcon />} >
              Home
            </Button>
          </Toolbar>
        </AppBar>

        <Container
          maxWidth='lg'
          sx={{
            flexGrow: 1,
            pt: 4,
            pb: 8,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}
        >
          <Outlet />
        </Container>

        <Box component='footer' sx={{ py: 3, bgcolor: 'grey.200', textAlign: 'center' }}>

        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default Layout