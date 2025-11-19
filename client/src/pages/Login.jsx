import React, {useState} from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserAuth } from "../context/AuthContext.jsx";

const Login = () => {
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
        }catch (error) {
            console.error("Login failed:", error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
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