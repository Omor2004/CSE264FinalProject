import React, {useState} from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserAuth } from "../context/AuthContext.jsx";

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState("")

  const { session, signUpNewUser } = UserAuth()
  const navigate = useNavigate();
  console.log("Current session:", session)

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await signUpNewUser(email, password, username)
      if(result.success){
        console.log("Sign up successful:", result.data)
        navigate("/")
    }
    }catch (err) {
      console.error("Sign up failed:", err)
      setError(err.message)
    } finally {
      setLoading(false)
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