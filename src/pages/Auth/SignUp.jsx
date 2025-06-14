/* eslint-disable no-unused-vars */
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import {
  UserIcon,
  PhoneIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from 'lucide-react'
import { useState } from 'react'

const Container = styled.div`
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
    animation: rotate 25s linear infinite;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 20%;
    right: 10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
    border-radius: 50%;
    animation: float 6s ease-in-out infinite;
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

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`

const FormContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  /* border-radius: 24px; */
  padding: 3rem;
  width: 100%;
  max-width: 520px;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

const Title = styled(motion.h1)`
  font-size: 2.25rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  transition: all 0.2s ease;
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

  &:focus + ${InputIcon} {
    color: #667eea;
    transform: scale(1.1);
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

  ${(props) =>
    props.valid &&
    `
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.05);
  `}
`

const PasswordToggle = styled(motion.button)`
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 2;

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
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

const SuccessMessage = styled(motion.span)`
  color: #10b981;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
`

const PasswordStrength = styled(motion.div)`
  display: flex;
  gap: 0.25rem;
  margin-top: 0.5rem;
`

const StrengthBar = styled.div`
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: ${(props) => (props.active ? props.color : '#e5e7eb')};
  transition: all 0.3s ease;
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

const Footer = styled(motion.p)`
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;

    &:hover {
      color: #764ba2;
      text-decoration: underline;
    }
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

const Spinner = () => (
  <SpinnerWrapper>
    <SpinnerRing />
  </SpinnerWrapper>
)

function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const { signup, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const password = watch('password', '')
  const confirmPassword = watch('confirmPassword', '')

  const getPasswordStrength = (password) => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(password)

  const getStrengthColor = (level) => {
    const colors = ['#ef4444', '#f59e0b', '#eab308', '#10b981']
    return colors[level - 1] || '#e5e7eb'
  }

  const getStrengthText = (strength) => {
    const texts = ['Weak', 'Fair', 'Good', 'Strong']
    return texts[strength - 1] || ''
  }

  const onSubmit = async (data) => {
    try {
      const response = await signup({
        name: data.name,
        contact: data.contact,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })

      toast.success('Signed Up successfully! Navigating to login page...')
      navigate('/login')
    } catch (error) {
      console.error('Error signing up user:', error)
      toast.error(error.message || 'Error signing up user. Please try again or contact support')
    }
  }

  if (isAuthenticated) {
    navigate('/dashboard/profile')
    return
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <Container>
      <FormContainer variants={containerVariants} initial="hidden" animate="visible">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Title variants={itemVariants}>
            <ShieldCheckIcon size={32} />
            Get Started with us!
          </Title>

          <FormGroup variants={itemVariants}>
            <Label htmlFor="name">
              <UserIcon size={16} />
              Full Name
            </Label>
            <InputWrapper>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                error={errors.name}
                valid={!errors.name && watch('name')}
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                whileFocus={{ scale: 1.01 }}
              />
              <InputIcon>
                <UserIcon size={20} />
              </InputIcon>
            </InputWrapper>
            <AnimatePresence>
              {errors.name && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {errors.name.message}
                </ErrorMessage>
              )}
              {!errors.name && watch('name') && watch('name').length >= 2 && (
                <SuccessMessage initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <CheckCircleIcon size={16} />
                  Looks good!
                </SuccessMessage>
              )}
            </AnimatePresence>
          </FormGroup>

          <FormGroup variants={itemVariants}>
            <Label htmlFor="contact">
              <PhoneIcon size={16} />
              Contact Number
            </Label>
            <InputWrapper>
              <Input
                id="contact"
                type="tel"
                placeholder="Enter your contact number"
                error={errors.contact}
                valid={!errors.contact && watch('contact')}
                {...register('contact', {
                  required: 'Contact number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Please enter a valid 10-digit phone number',
                  },
                })}
                whileFocus={{ scale: 1.01 }}
              />
              <InputIcon>
                <PhoneIcon size={20} />
              </InputIcon>
            </InputWrapper>
            <AnimatePresence>
              {errors.contact && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {errors.contact.message}
                </ErrorMessage>
              )}
              {!errors.contact && watch('contact') && /^[0-9]{10}$/.test(watch('contact')) && (
                <SuccessMessage initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <CheckCircleIcon size={16} />
                  Valid contact number
                </SuccessMessage>
              )}
            </AnimatePresence>
          </FormGroup>

          <FormGroup variants={itemVariants}>
            <Label htmlFor="email">
              <MailIcon size={16} />
              Email Address
            </Label>
            <InputWrapper>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                error={errors.email}
                valid={!errors.email && watch('email')}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
                whileFocus={{ scale: 1.01 }}
              />
              <InputIcon>
                <MailIcon size={20} />
              </InputIcon>
            </InputWrapper>
            <AnimatePresence>
              {errors.email && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {errors.email.message}
                </ErrorMessage>
              )}
              {!errors.email && watch('email') && /^\S+@\S+$/i.test(watch('email')) && (
                <SuccessMessage initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <CheckCircleIcon size={16} />
                  Valid email address
                </SuccessMessage>
              )}
            </AnimatePresence>
          </FormGroup>

          <FormGroup variants={itemVariants}>
            <Label htmlFor="password">
              <LockIcon size={16} />
              Password
            </Label>
            <InputWrapper>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                error={errors.password}
                valid={!errors.password && passwordStrength >= 3}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
                whileFocus={{ scale: 1.01 }}
              />
              <InputIcon>
                <LockIcon size={20} />
              </InputIcon>
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </PasswordToggle>
            </InputWrapper>
            {password && (
              <PasswordStrength initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {[1, 2, 3, 4].map((level) => (
                  <StrengthBar
                    key={level}
                    active={level <= passwordStrength}
                    color={getStrengthColor(level)}
                  />
                ))}
              </PasswordStrength>
            )}
            <AnimatePresence>
              {errors.password && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {errors.password.message}
                </ErrorMessage>
              )}
              {password && passwordStrength > 0 && (
                <SuccessMessage initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  Password strength: {getStrengthText(passwordStrength)}
                </SuccessMessage>
              )}
            </AnimatePresence>
          </FormGroup>

          <FormGroup variants={itemVariants}>
            <Label htmlFor="confirmPassword">
              <LockIcon size={16} />
              Confirm Password
            </Label>
            <InputWrapper>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                error={errors.confirmPassword}
                valid={!errors.confirmPassword && confirmPassword && password === confirmPassword}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
                whileFocus={{ scale: 1.01 }}
              />
              <InputIcon>
                <LockIcon size={20} />
              </InputIcon>
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </PasswordToggle>
            </InputWrapper>
            <AnimatePresence>
              {errors.confirmPassword && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {errors.confirmPassword.message}
                </ErrorMessage>
              )}
              {!errors.confirmPassword && confirmPassword && password === confirmPassword && (
                <SuccessMessage initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                  <CheckCircleIcon size={16} />
                  Passwords match!
                </SuccessMessage>
              )}
            </AnimatePresence>
          </FormGroup>

          <Button
            type="submit"
            disabled={isSubmitting}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <>
                <Spinner /> Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRightIcon size={20} />
              </>
            )}
          </Button>

          <Footer variants={itemVariants}>
            © {new Date().getFullYear()} Mendt Technologies Pvt. Ltd. All rights reserved.
          </Footer>
          <Footer variants={itemVariants}>
            Already have an account? <Link to="/login">Sign In</Link>
          </Footer>
        </Form>
      </FormContainer>
    </Container>
  )
}

export default SignUp
