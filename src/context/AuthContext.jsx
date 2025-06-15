/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '@/services/authService'
import PropTypes from 'prop-types'
import { useMutation } from '@tanstack/react-query'

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getUser())
  const [isLoading, setIsLoading] = useState(true)

  // On first load, restore user if present
  useEffect(() => {
    const storedUser = authService.getUser()

    setUser(storedUser)
    setIsLoading(false)
  }, [])

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const userData = await authService.login(credentials)
      setUser(userData)
      return userData
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authService.logout()
      setUser(null)
    },
  })

  const signupMutation = useMutation({
    mutationFn: async (credentials) => {
      const userData = await authService.signup(credentials)
      setUser(userData)
      return userData
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: async (data) => {
      return await authService.changePassword(data)
    },
  })

  return (
    <AuthContext.Provider
      value={{
        user: user,
        isAuthenticated: !!user,
        isLoading,
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        signup: signupMutation.mutateAsync,
        changePassword: changePasswordMutation.mutateAsync,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
