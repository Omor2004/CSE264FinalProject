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

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false) //d: i set this to false due to supabase session looping to many times when login
  const { session, signUpNewUser } = UserAuth || {}
  const navigate = useNavigate();
  console.log("Current session:", session)

  useEffect(() => {
    if(session) {
        console.log('session updated, navigating to home.')
        navigate('/')
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
            <Box sx={{mt: 8}}>
                <Typography variant="h4" component="h2" mb={2} color="primary" fontWeight={700}>
                    Login
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
                        value={password}
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