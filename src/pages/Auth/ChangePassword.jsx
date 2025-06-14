import React, { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { Eye, EyeOff, Lock, Shield, AlertCircle, ArrowLeft } from 'lucide-react'

const ChangePasswordContainer = styled.div`
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

const ChangePasswordFormContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  /* border-radius: 24px; */
  padding: 3rem;
  width: 100%;
  max-width: 680px;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
`

const BackButton = styled(motion.button)`
  position: absolute;
  top: 3rem;
  left: 3rem;
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
  z-index: 100;

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`

const ChangePasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
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
  padding: 1rem 3rem 1rem 3rem;
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

const PasswordStrengthIndicator = styled(motion.div)`
  margin-top: 0.5rem;
  display: flex;
  gap: 0.25rem;
  align-items: center;
`

const StrengthBar = styled.div`
  height: 4px;
  flex: 1;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${(props) => props.strength}%;
    background: ${(props) => {
      if (props.strength < 30) return '#ef4444'
      if (props.strength < 70) return '#f59e0b'
      return '#10b981'
    }};
    transition: all 0.3s ease;
  }
`

const StrengthText = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
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

const SecurityTip = styled(motion.div)`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`

const SecurityTipText = styled.p`
  font-size: 0.875rem;
  color: #475569;
  margin: 0;
  line-height: 1.5;
`

const ChangePassword = () => {
  const navigate = useNavigate()
  const { changePassword, logout } = useAuth()

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [errors, setErrors] = useState({})

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 12.5
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5
    return Math.min(strength, 100)
  }

  const getStrengthLabel = (strength) => {
    if (strength < 30) return 'Weak'
    if (strength < 70) return 'Medium'
    return 'Strong'
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long'
    }

    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Please confirm your new password'
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match'
    }

    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      newErrors.newPassword = 'New password must be different from current password'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors below')
      return
    }

    setLoading(true)
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      })

      toast.success('Password changed successfully! Please login again.', {
        duration: 4000,
        style: {
          background: '#10b981',
          color: 'white',
        },
      })

      // Small delay to show success message before logout
      setTimeout(() => {
        logout()
        navigate('/login')
      }, 1500)
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to change password. Please try again.'
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
    navigate(-1)
  }

  const passwordStrength = calculatePasswordStrength(formData.newPassword)

  return (
    <ChangePasswordContainer>
      <BackButton onClick={handleBack} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <ArrowLeft size={20} />
      </BackButton>

      <ChangePasswordFormContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Change Password
        </Title>

        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Update your password to keep your account secure
        </Subtitle>

        <ChangePasswordForm onSubmit={handleSubmit}>
          <FormGroup
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Label htmlFor="currentPassword">Current Password</Label>
            <InputWrapper>
              <InputIcon>
                <Lock size={18} />
              </InputIcon>
              <Input
                id="currentPassword"
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                placeholder="Enter your current password"
                value={formData.currentPassword}
                onChange={handleChange}
                error={errors.currentPassword}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>
            </InputWrapper>
            <AnimatePresence>
              {errors.currentPassword && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AlertCircle size={16} />
                  {errors.currentPassword}
                </ErrorMessage>
              )}
            </AnimatePresence>
          </FormGroup>

          <FormGroup
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Label htmlFor="newPassword">New Password</Label>
            <InputWrapper>
              <InputIcon>
                <Shield size={18} />
              </InputIcon>
              <Input
                id="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>
            </InputWrapper>

            {formData.newPassword && (
              <PasswordStrengthIndicator
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <StrengthBar strength={passwordStrength} />
                <StrengthText>{getStrengthLabel(passwordStrength)}</StrengthText>
              </PasswordStrengthIndicator>
            )}

            <AnimatePresence>
              {errors.newPassword && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AlertCircle size={16} />
                  {errors.newPassword}
                </ErrorMessage>
              )}
            </AnimatePresence>
          </FormGroup>

          <FormGroup
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <InputWrapper>
              <InputIcon>
                <Shield size={18} />
              </InputIcon>
              <Input
                id="confirmNewPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmNewPassword"
                placeholder="Confirm your new password"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                error={errors.confirmNewPassword}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>
            </InputWrapper>
            <AnimatePresence>
              {errors.confirmNewPassword && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AlertCircle size={16} />
                  {errors.confirmNewPassword}
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
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {loading ? (
              <SpinnerWrapper>
                <SpinnerRing />
                <span style={{ marginLeft: '0.5rem' }}>Updating Password...</span>
              </SpinnerWrapper>
            ) : (
              <>
                <Shield size={18} />
                Change Password
              </>
            )}
          </Button>
        </ChangePasswordForm>

        <SecurityTip
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Shield size={18} style={{ color: '#667eea', marginTop: '0.125rem' }} />
          <SecurityTipText>
            <strong>Security Tip:</strong> Use a strong password with at least 8 characters,
            including uppercase letters, lowercase letters, numbers, and special characters.
          </SecurityTipText>
        </SecurityTip>
      </ChangePasswordFormContainer>
    </ChangePasswordContainer>
  )
}

export default ChangePassword
