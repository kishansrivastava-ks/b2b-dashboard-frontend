import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import api from '@/services/api'
import {
  User,
  Mail,
  Phone,
  Building,
  FileText,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react'

const PageContainer = styled.div`
  /* min-height: 100vh; */
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

const Container = styled(motion.div)`
  /* max-width: 800px; */
  min-height: 80vh;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  /* border-radius: 24px; */
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
  overflow: hidden;
`

const Header = styled(motion.div)`
  padding: 3rem 3rem 2rem;
  text-align: center;
  position: relative;
`

const BackButton = styled(motion.button)`
  position: absolute;
  left: 2rem;
  top: 2rem;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 0.75rem;
  color: #667eea;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.2);
    transform: translateX(-2px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

const Title = styled(motion.h1)`
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
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
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`

const Subtitle = styled(motion.p)`
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
  margin-top: 2rem;
`

const FormContainer = styled.div`
  padding: 0 3rem 3rem;
`

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
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

  svg {
    width: 16px;
    height: 16px;
    color: #667eea;
  }
`

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const Input = styled(motion.input)`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid ${(props) => (props.error ? '#ef4444' : props.success ? '#10b981' : '#e5e7eb')};
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
    props.success &&
    `
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.05);
  `}
`

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: ${(props) => (props.error ? '#ef4444' : props.success ? '#10b981' : '#9ca3af')};
  z-index: 2;
  transition: color 0.2s ease;
`

const ValidationIcon = styled.div`
  position: absolute;
  right: 1rem;
  color: ${(props) => (props.success ? '#10b981' : '#ef4444')};
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
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

  svg {
    width: 14px;
    height: 14px;
  }
`

const SuccessMessage = styled(motion.span)`
  color: #10b981;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;

  svg {
    width: 14px;
    height: 14px;
  }
`

const ButtonGroup = styled(motion.div)`
  grid-column: 1 / -1;
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
`

const Button = styled(motion.button)`
  padding: 1rem 2rem;
  background: ${(props) =>
    props.variant === 'secondary'
      ? 'rgba(102, 126, 234, 0.1)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: ${(props) => (props.variant === 'secondary' ? '#667eea' : 'white')};
  border: ${(props) =>
    props.variant === 'secondary' ? '1px solid rgba(102, 126, 234, 0.2)' : 'none'};
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
  box-shadow: ${(props) =>
    props.variant === 'secondary'
      ? '0 4px 12px rgba(102, 126, 234, 0.15)'
      : '0 8px 25px rgba(102, 126, 234, 0.3)'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 150px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.variant === 'secondary'
        ? '0 6px 20px rgba(102, 126, 234, 0.25)'
        : '0 12px 35px rgba(102, 126, 234, 0.4)'};
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

  svg {
    width: 18px;
    height: 18px;
  }
`

const LoadingSpinner = styled.div`
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

const ProgressBar = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  transform-origin: left;
`

const UpdateProfile = () => {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    representativeName: '',
    representativeContact: '',
    gstNumber: '',
  })

  const [errors, setErrors] = useState({})
  const [validFields, setValidFields] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (user) {
      const initialData = {
        name: user.name || '',
        email: user.email || '',
        contact: user.contact || '',
        representativeName: user.representativeName || '',
        representativeContact: user.representativeContact || '',
        gstNumber: user.gstNumber || '',
      }
      setFormData(initialData)
    }
  }, [user])

  const validateField = (name, value) => {
    const newErrors = { ...errors }
    const newValidFields = { ...validFields }

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required'
          delete newValidFields.name
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters'
          delete newValidFields.name
        } else {
          delete newErrors.name
          newValidFields.name = true
        }
        break
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value.trim()) {
          newErrors.email = 'Email is required'
          delete newValidFields.email
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email'
          delete newValidFields.email
        } else {
          delete newErrors.email
          newValidFields.email = true
        }
        break
      }
      case 'contact': {
        const phoneRegex = /^\+?[\d\s\-()]{10,}$/
        if (!value.trim()) {
          newErrors.contact = 'Contact is required'
          delete newValidFields.contact
        } else if (!phoneRegex.test(value)) {
          newErrors.contact = 'Please enter a valid contact number'
          delete newValidFields.contact
        } else {
          delete newErrors.contact
          newValidFields.contact = true
        }
        break
      }
      case 'gstNumber':
        if (value.trim() && value.length !== 15) {
          newErrors.gstNumber = 'GST number must be 15 characters'
          delete newValidFields.gstNumber
        } else {
          delete newErrors.gstNumber
          if (value.trim()) newValidFields.gstNumber = true
        }
        break
      default:
        break
    }

    setErrors(newErrors)
    setValidFields(newValidFields)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setHasChanges(true)

    // Real-time validation
    validateField(name, value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key])
    })

    // Check for required field errors
    const requiredFields = ['name', 'email', 'contact']
    const hasErrors = requiredFields.some((field) => errors[field] || !formData[field].trim())

    if (hasErrors) {
      toast.error('Please fix all errors before submitting')
      return
    }

    setIsLoading(true)

    try {
      const { data } = await api.put('/user/update-profile', formData)
      toast.success('Profile updated successfully!')
      setUser(data.user)
      setHasChanges(false)

      // Small delay for better UX
      setTimeout(() => {
        navigate('/dashboard/profile')
      }, 1000)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to update profile'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        navigate('/dashboard/profile')
      }
    } else {
      navigate('/dashboard/profile')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <PageContainer>
      <Container variants={containerVariants} initial="hidden" animate="visible">
        <Header variants={itemVariants}>
          <BackButton
            onClick={handleCancel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft />
          </BackButton>
          <Title>Update Profile</Title>
          <Subtitle>Keep your information up to date</Subtitle>
        </Header>

        <FormContainer>
          <Form onSubmit={handleSubmit}>
            <FormGroup variants={itemVariants}>
              <Label>
                <User />
                Full Name *
              </Label>
              <InputWrapper>
                <InputIcon error={errors.name} success={validFields.name}>
                  <User />
                </InputIcon>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  error={errors.name}
                  success={validFields.name}
                  required
                />
                {validFields.name && (
                  <ValidationIcon success>
                    <Check />
                  </ValidationIcon>
                )}
                {errors.name && (
                  <ValidationIcon>
                    <X />
                  </ValidationIcon>
                )}
              </InputWrapper>
              <AnimatePresence>
                {errors.name && (
                  <ErrorMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <AlertCircle />
                    {errors.name}
                  </ErrorMessage>
                )}
                {validFields.name && !errors.name && (
                  <SuccessMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Check />
                    Looks good!
                  </SuccessMessage>
                )}
              </AnimatePresence>
            </FormGroup>

            <FormGroup variants={itemVariants}>
              <Label>
                <Mail />
                Email Address *
              </Label>
              <InputWrapper>
                <InputIcon error={errors.email} success={validFields.email}>
                  <Mail />
                </InputIcon>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  error={errors.email}
                  success={validFields.email}
                  required
                />
                {validFields.email && (
                  <ValidationIcon success>
                    <Check />
                  </ValidationIcon>
                )}
                {errors.email && (
                  <ValidationIcon>
                    <X />
                  </ValidationIcon>
                )}
              </InputWrapper>
              <AnimatePresence>
                {errors.email && (
                  <ErrorMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <AlertCircle />
                    {errors.email}
                  </ErrorMessage>
                )}
                {validFields.email && !errors.email && (
                  <SuccessMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Check />
                    Valid email format!
                  </SuccessMessage>
                )}
              </AnimatePresence>
            </FormGroup>

            <FormGroup variants={itemVariants}>
              <Label>
                <Phone />
                Contact Number *
              </Label>
              <InputWrapper>
                <InputIcon error={errors.contact} success={validFields.contact}>
                  <Phone />
                </InputIcon>
                <Input
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Enter your contact number"
                  error={errors.contact}
                  success={validFields.contact}
                  required
                />
                {validFields.contact && (
                  <ValidationIcon success>
                    <Check />
                  </ValidationIcon>
                )}
                {errors.contact && (
                  <ValidationIcon>
                    <X />
                  </ValidationIcon>
                )}
              </InputWrapper>
              <AnimatePresence>
                {errors.contact && (
                  <ErrorMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <AlertCircle />
                    {errors.contact}
                  </ErrorMessage>
                )}
                {validFields.contact && !errors.contact && (
                  <SuccessMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Check />
                    Valid contact number!
                  </SuccessMessage>
                )}
              </AnimatePresence>
            </FormGroup>

            <FormGroup variants={itemVariants}>
              <Label>
                <User />
                Representative Name
              </Label>
              <InputWrapper>
                <InputIcon>
                  <User />
                </InputIcon>
                <Input
                  name="representativeName"
                  value={formData.representativeName}
                  onChange={handleChange}
                  placeholder="Enter representative name (optional)"
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup variants={itemVariants}>
              <Label>
                <Phone />
                Representative Contact
              </Label>
              <InputWrapper>
                <InputIcon>
                  <Phone />
                </InputIcon>
                <Input
                  name="representativeContact"
                  value={formData.representativeContact}
                  onChange={handleChange}
                  placeholder="Enter representative contact (optional)"
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup variants={itemVariants}>
              <Label>
                <FileText />
                GST Number
              </Label>
              <InputWrapper>
                <InputIcon error={errors.gstNumber} success={validFields.gstNumber}>
                  <FileText />
                </InputIcon>
                <Input
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="Enter GST number (optional)"
                  error={errors.gstNumber}
                  success={validFields.gstNumber}
                  maxLength={15}
                />
                {validFields.gstNumber && (
                  <ValidationIcon success>
                    <Check />
                  </ValidationIcon>
                )}
                {errors.gstNumber && (
                  <ValidationIcon>
                    <X />
                  </ValidationIcon>
                )}
              </InputWrapper>
              <AnimatePresence>
                {errors.gstNumber && (
                  <ErrorMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <AlertCircle />
                    {errors.gstNumber}
                  </ErrorMessage>
                )}
                {validFields.gstNumber && !errors.gstNumber && (
                  <SuccessMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Check />
                    Valid GST format!
                  </SuccessMessage>
                )}
              </AnimatePresence>
            </FormGroup>

            <ButtonGroup variants={itemVariants}>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <ArrowLeft />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !hasChanges || Object.keys(errors).length > 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner>
                      <Loader2 />
                    </LoadingSpinner>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save />
                    Update Profile
                  </>
                )}
              </Button>
            </ButtonGroup>
          </Form>
        </FormContainer>

        {isLoading && (
          <ProgressBar
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        )}
      </Container>
    </PageContainer>
  )
}

export default UpdateProfile
