// src/pages/AuthPage.jsx
import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'

const AuthPage = () => {
  const { login, isLoading } = useAuth()
  const [isSignup, setIsSignup] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, phone, password, confirmPassword } = formData

    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          toast.error('Passwords do not match')
          return
        }
        await login({ name, email, phone, password, confirmPassword, isSignup: true })
        toast.success('Signup successful')
      } else {
        await login({ phone, password })
        toast.success('Login successful')
      }
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          type="text"
          placeholder="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {isSignup && (
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
        </button>
        <p>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span onClick={() => setIsSignup(!isSignup)}>{isSignup ? 'Login' : 'Sign Up'}</span>
        </p>
        {!isSignup && (
          <small onClick={() => toast('Redirect to Forgot Password')}>Forgot Password?</small>
        )}
      </Form>
    </Container>
  )
}

export default AuthPage

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f1f5f9;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  input {
    margin: 0.5rem 0;
    padding: 0.75rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  button {
    padding: 0.75rem;
    background: #2563eb;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
  }

  p {
    text-align: center;
    margin-top: 1rem;

    span {
      color: #2563eb;
      cursor: pointer;
      text-decoration: underline;
    }
  }

  small {
    margin-top: 0.5rem;
    text-align: center;
    cursor: pointer;
    color: #555;
  }
`
