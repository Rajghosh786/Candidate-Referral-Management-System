import React, { createContext, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(null)
  return (
    <AuthContext.Provider value={{isLoggedIn,setIsLoggedIn,userData,setUserData}}>
        {children}
    </AuthContext.Provider>
  )
}