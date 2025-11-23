import React, {useEffect, useState} from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserAuth } from "../context/AuthContext.jsx";

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false) //d: i set this to false due to supabase session looping to many times when login
  const { session, signUpNewUser } = UserAuth()
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
    <>
      <form onSubmit={handleSignUp}>
        <h2>Sign up!</h2>
        <p>Already have an account? <Link to='/login'>Log in</Link></p>
        <div>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            type="email" 
            placeholder="Email" 
            required 
          />
          <input 
            onChange={(e) => setUsername(e.target.value)} 
            type="text" 
            placeholder="Username" 
            required 
          />
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            type="password" 
            placeholder="Password" 
            required 
          />
          <button type="submit" disabled={loading}>
            Sign Up
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      </form>
    </>
  );
}

export default Signup;