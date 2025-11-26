import React, {useState} from "react"
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
    const theme = useTheme()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState("")
    
    const { session, login } = UserAuth()
    const navigate = useNavigate();
    console.log("Current session:", session)

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await login(email, password)
            if(result.success){
                console.log("Sign up successful:", result.data)
                navigate("/")
            }
        }catch (err) {
            console.error("Login failed:", error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{
                mt: 8,
                p: 4,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: 3,
            }}>
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