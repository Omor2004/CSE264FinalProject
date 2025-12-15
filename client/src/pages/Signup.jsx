import React, {useEffect, useState} from "react"
import { Link, useNavigate } from "react-router-dom"
import { 
  Container, 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert,
  Stack
} from "@mui/material"
import { UserAuth } from "../context/AuthContext.jsx";

import backgroundImage from '../images/transparent-background-login2.png'
const BACKGROUND_IMAGE_URL = backgroundImage

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false) //d: i set this to false due to supabase session looping to many times when login
  const { session, signUpNewUser } = UserAuth() || {}
  const navigate = useNavigate();
  console.log("Current session:", session)

  useEffect(() => {
    if(session) {
        console.log('session updated, navigating to home.')
        navigate('/current-season')
    }
}, [session, navigate])

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signUpNewUser(email, password, username)
    } catch (error) {
      console.error("Sign up failed:", error)
      setError(error.message)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box 
          component="img"
          src={BACKGROUND_IMAGE_URL}
          alt="Anime Character"
          sx={{
              position: 'absolute',
              top: { xs: 470, sm: 450, md: 450 },
              right: { xs: 0, sm: 0, md: 0 },
              width: { xs: 250, sm: 250, md: 250 },
              height: 'auto',
              zIndex: 1,
              opacity: 1,
              overflow: 'hidden',
              pointerEvents: 'none',
              transform: { xs: 'translateY(-10%)', sm: 'none' }
              
          }}
          onError={(e) => { e.target.style.display = 'none'; console.error("Image failed to load:", BACKGROUND_IMAGE_URL); }}
      />
            <Box sx={{mt: 8}}>
                <Typography variant="h4" component="h2" mb={2} color="primary" fontWeight={700}>
                    Sign Up!
                </Typography>
                <Stack component="form" onSubmit={handleSignUp} spacing={2}>
                    <TextField
                        fullWidth
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? "Logging In..." : "Log In"}
                    </Button>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Typography>
                        Already have an account? <Link to='/login'>Log in</Link>
                    </Typography>
                </Stack>
            </Box>
        </Container>
    
  );
}

export default Signup;