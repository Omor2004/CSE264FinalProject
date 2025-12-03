import {createContext, useState, useEffect, useContext} from "react"
import {supabase} from "../supabaseClient.js"

const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(undefined)

    const addUserToTable = async (id, username) => {
        const { data, error } = await supabase
            .from("users")
            .insert([{ id, username }])

        if (error) {
            console.error("Error adding user to table:", error.message)
            return { success: false, error: error.message }
        }

        return { success: true, data }
    }


    // sign up
    const signUpNewUser = async (email, password, username) => {
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username,
                }
            },
        })

        if(error){
            console.error("Error signing up:", error.message)
            return {success: false, error}
        }

        if (data.user) {
            const userId = data.user.id
            const username = data.user.user_metadata.username
            const tableResult = await addUserToTable(userId, username)
            if (!tableResult.success) {
                return { success: false, error: tableResult.error }
            }
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
    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
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