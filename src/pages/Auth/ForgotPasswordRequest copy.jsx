import React, { useState } from 'react'
import styled from 'styled-components'
import { toast } from 'react-hot-toast'
import api from '@/services/api'

const Container = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 32px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`

const Title = styled.h2`
  text-align: center;
  margin-bottom: 24px;
`

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
`

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`

const ForgotPasswordRequest = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/auth/forgot-password', { email })
      toast.success('Reset link sent! Check your email.')
    } catch (error) {
      const msg = error?.response?.data?.message || 'Something went wrong'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <Title>Forgot Password</Title>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
    </Container>
  )
}

export default ForgotPasswordRequest
