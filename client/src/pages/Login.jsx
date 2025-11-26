import React, {useEffect, useState} from "react"
import { Link, useNavigate } from "react-router-dom"
import { 
  Container, 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert,
  useTheme,
  Stack
} from "@mui/material"
import { UserAuth } from "../context/AuthContext.jsx";

const Login = () => {
    const { session, login } = UserAuth || {}
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false) //d: i set this to false due to supabase session looping to many times when login
    const navigate = useNavigate();
    console.log("Current session:", session)

    useEffect(() => {
        if(session) {
            console.log('session updated, navigating to home.')
            navigate('/')
        }
    }, [session, navigate])

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (!login) {
            setError("Authentication service not available.")
            setLoading(false)
            return
        }

        try {
            await login(email, password)
        }catch (error) {
            console.error("Login failed:", error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }
    if (session) {
        return <p>Redirecting...</p>
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{mt: 8}}>
                <Typography variant="h4" component="h2" mb={2} color="primary" fontWeight={700}>
                    Login
                </Typography>
                <Stack component="form" onSubmit={handleLogin} spacing={2}>
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
                        Don't have an account? <Link to='/signup'>Sign up</Link>
                    </Typography>
                </Stack>
            </Box>
        </Container>
    );
}

export default Login;