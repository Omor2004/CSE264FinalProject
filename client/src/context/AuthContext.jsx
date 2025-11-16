import {createContext, useState, useEffect, useContext} from "react"
import {supabase} from "../supabaseClient.js"

const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(undefined)

    // sign up
    const signUpNewUser = async (email, password) => {
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if(error){
            console.error("Error signing up:", error.message)
            return {success: false, error}
        }
        return {success: true, data}
    }
    // log in
    const login = async (email, password) => {
        try{
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })
            if(error){
                console.error("sign in error occurred: ", error)
                return {success: false, error: error.message}
            }
            console.log("sign in success: ", data)
            return {success: true, data}
        } catch (error) {
            console.error("Error signing in:", error.message)
        }

    }
    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session)
        })
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    // sign out
    const signOut = ()  => {
        const { error } = supabase.auth.signOut()
        if (error) {
            console.error("Error signing out:", error.message)
        }
    }

    return (
        <AuthContext.Provider value={{session, signUpNewUser, login, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}