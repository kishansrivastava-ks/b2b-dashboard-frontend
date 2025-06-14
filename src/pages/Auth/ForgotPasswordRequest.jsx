import React, { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Mail, ArrowLeft, Check, Send, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '@/services/api'

const ForgotPasswordContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
    pointer-events: none;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const ForgotPasswordFormContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  /* border-radius: 24px; */
  padding: 3rem;
  width: 100%;
  max-width: 480px;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
`

const BackButton = styled(motion.button)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 12px;
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`

const IconWrapper = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
`

const SuccessIconWrapper = styled(motion.div)`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    opacity: 0.3;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.1;
    }
    100% {
      transform: scale(1);
      opacity: 0.3;
    }
  }
`

const ForgotPasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const Title = styled(motion.h1)`
  font-size: 2.25rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`

const Subtitle = styled(motion.p)`
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`

const FormGroup = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
`

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
`

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: #9ca3af;
  z-index: 2;
  transition: color 0.2s ease;
`

const Input = styled(motion.input)`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid ${(props) => (props.error ? '#ef4444' : '#e5e7eb')};
  border-radius: 16px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: #1f2937;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }

  &:focus ~ ${InputIcon} {
    color: #667eea;
  }

  &::placeholder {
    color: #9ca3af;
  }

  ${(props) =>
    props.error &&
    `
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.05);
  `}
`

const ErrorMessage = styled(motion.span)`
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
`

const Button = styled(motion.button)`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  margin-top: 1rem;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
`

const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const SpinnerRing = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const SuccessContent = styled(motion.div)`
  text-align: center;
  padding: 2rem 0;
`

const SuccessTitle = styled(motion.h2)`
  font-size: 1.75rem;
  font-weight: 700;
  color: #059669;
  margin-bottom: 1rem;
`

const SuccessMessage = styled(motion.p)`
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`

const ActionButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }
`

const InfoBox = styled(motion.div)`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`

const InfoText = styled.p`
  font-size: 0.875rem;
  color: #475569;
  margin: 0;
  line-height: 1.5;
`

const ForgotPasswordRequest = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setError('')
    setLoading(true)

    try {
      await api.post('/auth/forgot-password', { email })

      // Show success toast
      toast.success('Reset link sent successfully!', {
        duration: 3000,
        style: {
          background: '#10b981',
          color: 'white',
        },
      })

      // Set success state to show checkmark animation
      setSuccess(true)

      // Auto-close after 4 seconds
      setTimeout(() => {
        navigate('/login')
      }, 4000)
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to send reset link. Please try again.'
      setError(msg)
      toast.error(msg, {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/login')
  }

  const handleResendOrClose = () => {
    if (success) {
      navigate('/login')
    } else {
      // Reset form for resend
      setSuccess(false)
      setEmail('')
      setError('')
    }
  }

  return (
    <ForgotPasswordContainer>
      <BackButton onClick={handleBack} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <ArrowLeft size={20} />
      </BackButton>

      <ForgotPasswordFormContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <SuccessIconWrapper
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  duration: 0.6,
                  type: 'spring',
                  stiffness: 200,
                  damping: 10,
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.5,
                    duration: 0.3,
                    type: 'spring',
                    stiffness: 300,
                  }}
                >
                  <Check size={40} color="white" />
                </motion.div>
              </SuccessIconWrapper>

              <SuccessContent>
                <SuccessTitle
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  Email Sent Successfully!
                </SuccessTitle>

                <SuccessMessage
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  We've sent a password reset link to <strong>{email}</strong>. Please check your
                  email and follow the instructions to reset your password.
                </SuccessMessage>

                <ActionButton
                  onClick={handleResendOrClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </ActionButton>

                <InfoBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <Mail size={18} style={{ color: '#667eea', marginTop: '0.125rem' }} />
                  <InfoText>
                    <strong>Didn't receive the email?</strong> Check your spam folder or wait a few
                    minutes. The link will expire in 15 minutes for security reasons.
                  </InfoText>
                </InfoBox>
              </SuccessContent>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <IconWrapper
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, duration: 0.6, type: 'spring' }}
              >
                <Mail size={32} color="white" />
              </IconWrapper>

              <Title
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Forgot Password?
              </Title>

              <Subtitle
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                No worries! Enter your email address and we'll send you a link to reset your
                password.
              </Subtitle>

              <ForgotPasswordForm onSubmit={handleSubmit}>
                <FormGroup
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Label htmlFor="email">Email Address</Label>
                  <InputWrapper>
                    <InputIcon>
                      <Mail size={18} />
                    </InputIcon>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (error) setError('')
                      }}
                      error={error}
                      required
                    />
                  </InputWrapper>
                  <AnimatePresence>
                    {error && (
                      <ErrorMessage
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <AlertCircle size={16} />
                        {error}
                      </ErrorMessage>
                    )}
                  </AnimatePresence>
                </FormGroup>

                <Button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {loading ? (
                    <SpinnerWrapper>
                      <SpinnerRing />
                      <span style={{ marginLeft: '0.5rem' }}>Sending...</span>
                    </SpinnerWrapper>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Reset Link
                    </>
                  )}
                </Button>
              </ForgotPasswordForm>

              <InfoBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Mail size={18} style={{ color: '#667eea', marginTop: '0.125rem' }} />
                <InfoText>
                  <strong>Remember your password?</strong> You can always go back to the login page
                  and try signing in again.
                </InfoText>
              </InfoBox>
            </motion.div>
          )}
        </AnimatePresence>
      </ForgotPasswordFormContainer>
    </ForgotPasswordContainer>
  )
}

export default ForgotPasswordRequest
