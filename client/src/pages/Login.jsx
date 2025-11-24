import React, {useEffect, useState} from "react"
import { Link, useNavigate } from "react-router-dom"
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
        <>
            <form onSubmit={handleLogin}>
                <h2>Login</h2>
                <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
                <div>
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        type="email" 
                        placeholder="Email" 
                        required 
                    />
                    <input 
                        onChange={(e) => setPassword(e.target.value)} 
                        type="password" 
                        placeholder="Password" 
                        required 
                    />
                    <button type="submit" disabled={loading}>
                        Log In
                    </button>
                    {error && <p className="error-message">{error}</p>}
                </div>
            </form>
        </>
    );
}

export default Login;