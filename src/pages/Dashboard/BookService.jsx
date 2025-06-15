import React, { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import api from '@/services/api'
import { useQueryClient } from '@tanstack/react-query'

const BookingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;

  /* &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
    pointer-events: none;
  } */

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  z-index: 1;
`

const BookingFormContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  /* border-radius: 24px; */
  padding: 3rem;
  width: 100%;
  /* max-width: 800px; */
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;

  /* &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 24px 24px 0 0;
  } */
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
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`

const UserInfoSection = styled(motion.div)`
  background: rgba(102, 126, 234, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(102, 126, 234, 0.1);
`

const UserInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`

const UserInfoItem = styled.div`
  p {
    margin: 0.5rem 0;
    color: #374151;
    font-size: 0.9rem;

    strong {
      color: #1f2937;
      font-weight: 600;
    }
  }
`

const BookingForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const FormSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 1rem;
  letter-spacing: 0.025em;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
  display: block;
`

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
`

const ServiceCard = styled(motion.label)`
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid ${(props) => (props.checked ? '#667eea' : '#e5e7eb')};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  }

  ${(props) =>
    props.checked &&
    `
    background: rgba(102, 126, 234, 0.1);
    border-color: #667eea;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.05), transparent);
      animation: shimmer 2s ease-in-out infinite;
    }
  `}

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  input[type='checkbox'] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #d1d5db;
    border-radius: 6px;
    margin-right: 0.75rem;
    position: relative;
    transition: all 0.2s ease;

    &:checked {
      background: #667eea;
      border-color: #667eea;

      &::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        font-weight: bold;
      }
    }
  }

  span {
    font-weight: 500;
    color: #374151;
    flex: 1;
  }
`

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container input {
    width: 100%;
    padding: 1rem 1.25rem;
    border: 2px solid #e5e7eb;
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
  }
`

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`

const RadioCard = styled(motion.label)`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid ${(props) => (props.checked ? '#667eea' : '#e5e7eb')};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  justify-content: center;

  &:hover {
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-1px);
  }

  ${(props) =>
    props.checked &&
    `
    background: rgba(102, 126, 234, 0.1);
    border-color: #667eea;
  `}

  input[type="radio"] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #d1d5db;
    border-radius: 50%;
    margin-right: 0.5rem;
    position: relative;
    transition: all 0.2s ease;

    &:checked {
      border-color: #667eea;

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 8px;
        background: #667eea;
        border-radius: 50%;
      }
    }
  }

  span {
    font-weight: 500;
    color: #374151;
  }
`

const Input = styled(motion.input)`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e5e7eb;
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
`

const SubmitButton = styled(motion.button)`
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
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

const ProfileNote = styled(motion.div)`
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);

  h2 {
    background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 2rem;
  }
`

const CompleteProfileButton = styled(motion.button)`
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 1rem 2rem;
  font-weight: 600;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(245, 158, 11, 0.4);
  }
`

const BookService = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    services: [],
    bookingDate: null,
    newCustomer: '',
    additionalServices: '',
  })
  const [loading, setLoading] = useState(false)

  const queryClient = useQueryClient()

  const requiredFields = [
    user?.name,
    user?.contact,
    user?.representativeName,
    user?.representativeContact,
    user?.gstNumber,
  ]

  const isProfileComplete = requiredFields.every((field) => !!field)

  const handleCheckboxChange = (service) => {
    setForm((prev) => {
      const updated = prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service]
      return { ...prev, services: updated }
    })
  }

  const handleRadioChange = (value) => {
    setForm((prev) => ({ ...prev, newCustomer: value === 'yes' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.services.length || !form.bookingDate || form.newCustomer === '') {
      return toast.error('Please fill all required fields')
    }

    try {
      setLoading(true)
      await api.post('/service/book-service', {
        services: form.services,
        bookingDate: form.bookingDate,
        newCustomer: form.newCustomer,
        additionalServices: form.additionalServices,
      })
      toast.success('Service booked successfully!')
      setForm({
        services: [],
        bookingDate: null,
        newCustomer: '',
        additionalServices: '',
      })
      queryClient.invalidateQueries(['myBookings'])
      navigate('/dashboard/my-bookings')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  const serviceOptions = [
    'AC Service/Repair',
    'Deep Cleaning',
    'Pest Control',
    'Carpentry',
    'Plumbing',
    'Refrigerator Service/Repair',
  ]

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
    visible: { opacity: 1, y: 0 },
  }

  if (!isProfileComplete) {
    return (
      <BookingContainer>
        <ContentWrapper>
          <ProfileNote
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Complete Your Profile</h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Please complete your profile before booking a service to ensure we have all necessary
              information.
            </p>
            <CompleteProfileButton
              onClick={() => navigate('/update-profile')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Complete Profile
            </CompleteProfileButton>
          </ProfileNote>
        </ContentWrapper>
      </BookingContainer>
    )
  }

  return (
    <BookingContainer>
      <ContentWrapper>
        <BookingFormContainer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Book a Service
          </Title>

          <UserInfoSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#374151', fontWeight: '600' }}>
              Business Information
            </h3>
            <UserInfoGrid>
              <UserInfoItem>
                <p>
                  <strong>Business Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Business Contact:</strong> {user.contact}
                </p>
              </UserInfoItem>
              <UserInfoItem>
                <p>
                  <strong>Representative:</strong> {user.representativeName}
                </p>
                <p>
                  <strong>Representative Contact:</strong> {user.representativeContact}
                </p>
              </UserInfoItem>
              <UserInfoItem>
                <p>
                  <strong>GST Number:</strong> {user.gstNumber}
                </p>
              </UserInfoItem>
            </UserInfoGrid>
          </UserInfoSection>

          <BookingForm onSubmit={handleSubmit}>
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <FormSection variants={itemVariants}>
                <Label>Select Services *</Label>
                <ServicesGrid>
                  <AnimatePresence>
                    {serviceOptions.map((service, index) => (
                      <ServiceCard
                        key={service}
                        checked={form.services.includes(service)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="checkbox"
                          value={service}
                          checked={form.services.includes(service)}
                          onChange={() => handleCheckboxChange(service)}
                        />
                        <span>{service}</span>
                      </ServiceCard>
                    ))}
                  </AnimatePresence>
                </ServicesGrid>
              </FormSection>

              <FormSection variants={itemVariants}>
                <Label>Desired Booking Date *</Label>
                <DatePickerWrapper>
                  <DatePicker
                    selected={form.bookingDate}
                    onChange={(date) => setForm({ ...form, bookingDate: date })}
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                    placeholderText="Select a date"
                  />
                </DatePickerWrapper>
              </FormSection>

              <FormSection variants={itemVariants}>
                <Label>Is this a new customer? *</Label>
                <RadioGroup>
                  <RadioCard
                    checked={form.newCustomer === true}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      name="newCustomer"
                      value="yes"
                      checked={form.newCustomer === true}
                      onChange={(e) => handleRadioChange(e.target.value)}
                    />
                    <span>Yes</span>
                  </RadioCard>
                  <RadioCard
                    checked={form.newCustomer === false}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      name="newCustomer"
                      value="no"
                      checked={form.newCustomer === false}
                      onChange={(e) => handleRadioChange(e.target.value)}
                    />
                    <span>No</span>
                  </RadioCard>
                </RadioGroup>
              </FormSection>

              <FormSection variants={itemVariants}>
                <Label>Additional Services (Optional)</Label>
                <Input
                  type="text"
                  name="additionalServices"
                  value={form.additionalServices}
                  placeholder="Describe any additional services or special requirements..."
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      additionalServices: e.target.value,
                    }))
                  }
                  whileFocus={{ scale: 1.01 }}
                />
              </FormSection>

              <SubmitButton
                type="submit"
                disabled={loading}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <SpinnerWrapper>
                    <SpinnerRing />
                    <span style={{ marginLeft: '0.5rem' }}>Booking...</span>
                  </SpinnerWrapper>
                ) : (
                  'Book Service'
                )}
              </SubmitButton>
            </motion.div>
          </BookingForm>
        </BookingFormContainer>
      </ContentWrapper>
    </BookingContainer>
  )
}

export default BookService
