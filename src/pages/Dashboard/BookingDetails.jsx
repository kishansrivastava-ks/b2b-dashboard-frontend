import React from 'react'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import api from '@/services/api'
import { ArrowLeft } from 'lucide-react'

const statusSteps = ['in progress', 'vendor assigned', 'work in progress', 'completed']

const Container = styled(motion.div)`
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

const ContentWrapper = styled(motion.div)`
  /* max-width: 900px; */
  margin: 0 auto;
  position: relative;
  z-index: 1;
`

const BookingCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  /* border-radius: 24px; */
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  position: relative;

  /* &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  } */
`

const Header = styled.div`
  padding: 3rem 3rem 0;
  text-align: center;
`

const Title = styled(motion.h1)`
  font-size: 2.5rem;
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

const BookingId = styled(motion.p)`
  color: #6b7280;
  font-size: 1rem;
  margin: 1rem 0 2rem;
  font-weight: 500;
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
  z-index: 100;

  &:hover {
    background: rgba(102, 126, 234, 0.2);
    transform: translateX(-2px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

const StatusSection = styled(motion.div)`
  padding: 0 3rem 2rem;
  margin-bottom: 2rem;
`

const StatusCard = styled(motion.div)`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid rgba(102, 126, 234, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }
`

const CurrentStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
`

const StatusBadge = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  text-transform: capitalize;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
`

const StatusIcon = styled(motion.div)`
  font-size: 1.5rem;
`

const ProgressBar = styled.div`
  position: relative;
  margin: 2rem 0;
`

const ProgressLine = styled.div`
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  /* height: 4px; */
  background: #e5e7eb;
  border-radius: 2px;
  z-index: 1;
`

const ProgressFill = styled(motion.div)`
  position: absolute;
  top: 20px;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
`

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
`

const Step = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`

const StepDot = styled(motion.div)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  background: ${(props) =>
    props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e5e7eb'};
  color: ${(props) => (props.active ? 'white' : '#9ca3af')};
  box-shadow: ${(props) => (props.active ? '0 8px 25px rgba(102, 126, 234, 0.3)' : 'none')};
  border: 3px solid white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`

const StepLabel = styled.div`
  font-size: 0.75rem;
  font-weight: ${(props) => (props.active ? '600' : '500')};
  color: ${(props) => (props.active ? '#1f2937' : '#6b7280')};
  text-align: center;
  text-transform: capitalize;
  max-width: 80px;
  line-height: 1.2;
`

const DetailsGrid = styled(motion.div)`
  padding: 0 3rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`

const DetailCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid rgba(102, 126, 234, 0.1);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.15);
    border-color: rgba(102, 126, 234, 0.2);
  }
`

const DetailLabel = styled.div`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const DetailValue = styled.div`
  color: #1f2937;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
`

const VendorSection = styled(motion.div)`
  margin: 2rem 3rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid rgba(102, 126, 234, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  }
`

const VendorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
`

const VendorIcon = styled.div`
  font-size: 1.5rem;
`

const VendorTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`

const VendorCard = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.8);
`

const VendorImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #10b981;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
`

const VendorInfo = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`

const VendorDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const VendorLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const VendorValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
`

const StatusMessage = styled(motion.div)`
  margin: 2rem 3rem;
  padding: 2rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
  font-size: 1rem;
  background: ${(props) => {
    switch (props.type) {
      case 'completed':
        return 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
      case 'in-progress':
        return 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
      case 'work-in-progress':
        return 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
      default:
        return 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
    }
  }};
  color: ${(props) => {
    switch (props.type) {
      case 'completed':
        return '#065f46'
      case 'in-progress':
        return '#92400e'
      case 'work-in-progress':
        return '#1e40af'
      default:
        return '#374151'
    }
  }};
  border: 2px solid
    ${(props) => {
      switch (props.type) {
        case 'completed':
          return 'rgba(16, 185, 129, 0.2)'
        case 'in-progress':
          return 'rgba(245, 158, 11, 0.2)'
        case 'work-in-progress':
          return 'rgba(59, 130, 246, 0.2)'
        default:
          return 'rgba(156, 163, 175, 0.2)'
      }
    }};
`

const StatusEmoji = styled.span`
  font-size: 1.5rem;
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 2rem;
`

const Spinner = styled(motion.div)`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
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

const LoadingText = styled.p`
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
`

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1rem;
  text-align: center;
`

const ErrorText = styled.p`
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
`

const BookingDetails = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()

  const {
    data: booking,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const res = await api.get(`/service/my-bookings/${bookingId}`)
      return res.data.booking
    },
  })

  if (isLoading) {
    return (
      <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <ContentWrapper>
          <LoadingContainer>
            <Spinner />
            <LoadingText>Loading booking details...</LoadingText>
          </LoadingContainer>
        </ContentWrapper>
      </Container>
    )
  }

  if (isError) {
    toast.error(error?.response?.data?.message || 'Error fetching booking')
    return (
      <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <ContentWrapper>
          <ErrorContainer>
            <StatusEmoji>❌</StatusEmoji>
            <ErrorText>Error loading booking details</ErrorText>
          </ErrorContainer>
        </ContentWrapper>
      </Container>
    )
  }

  const currentStep = statusSteps.indexOf(booking.status)
  const progressPercentage = ((currentStep + 1) / statusSteps.length) * 100

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅'
      case 'in progress':
        return '⏳'
      case 'work in progress':
        return '🔧'
      case 'vendor assigned':
        return '👨‍🔧'
      case 'confirmed':
        return '✓'
      case 'pending':
        return '⏰'
      default:
        return '📋'
    }
  }

  const getStatusMessage = (status) => {
    switch (status) {
      case 'completed':
        return { type: 'completed', message: 'This booking has been successfully completed!' }
      case 'in progress':
        return { type: 'in-progress', message: 'Your booking is currently being processed.' }
      case 'work in progress':
        return { type: 'work-in-progress', message: 'Work is ongoing on your booking.' }
      case 'vendor assigned':
        return { type: 'vendor-assigned', message: 'A vendor has been assigned to your booking.' }
      default:
        return null
    }
  }

  const statusMessage = getStatusMessage(booking.status)

  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <ContentWrapper>
        <BackButton
          onClick={() => {
            navigate('/dashboard/my-bookings')
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft />
        </BackButton>
        <BookingCard
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Header>
            <Title
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Booking Details
            </Title>
            <BookingId
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Booking ID: #{bookingId}
            </BookingId>
          </Header>

          <StatusSection>
            <StatusCard
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <CurrentStatus>
                <StatusIcon
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6, type: 'spring' }}
                >
                  {getStatusIcon(booking.status)}
                </StatusIcon>
                <StatusBadge
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {booking.status}
                </StatusBadge>
              </CurrentStatus>

              <ProgressBar>
                <ProgressLine />
                <ProgressFill
                  style={{ width: `${progressPercentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
                <StepsContainer>
                  {statusSteps.map((step, idx) => (
                    <Step key={step}>
                      <StepDot
                        active={idx <= currentStep}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.8 + idx * 0.1,
                          type: 'spring',
                        }}
                      >
                        {idx + 1}
                      </StepDot>
                      <StepLabel active={idx <= currentStep}>{step}</StepLabel>
                    </Step>
                  ))}
                </StepsContainer>
              </ProgressBar>
            </StatusCard>
          </StatusSection>

          <DetailsGrid>
            <DetailCard
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              whileHover={{ y: -2 }}
            >
              <DetailLabel>🛠️ Services</DetailLabel>
              <DetailValue>{booking.services.join(', ')}</DetailValue>
            </DetailCard>

            <DetailCard
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              whileHover={{ y: -2 }}
            >
              <DetailLabel>📅 Booking Date</DetailLabel>
              <DetailValue>{format(new Date(booking.bookingDate), 'dd MMM yyyy')}</DetailValue>
            </DetailCard>

            <DetailCard
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              whileHover={{ y: -2 }}
            >
              <DetailLabel>👤 New Customer</DetailLabel>
              <DetailValue>{booking.newCustomer ? 'Yes' : 'No'}</DetailValue>
            </DetailCard>

            <DetailCard
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              whileHover={{ y: -2 }}
            >
              <DetailLabel>➕ Additional Services</DetailLabel>
              <DetailValue>{booking.additionalServices || 'None'}</DetailValue>
            </DetailCard>
          </DetailsGrid>

          {booking.status === 'vendor assigned' && booking.vendor && (
            <VendorSection
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.6 }}
            >
              <VendorHeader>
                <VendorIcon>👨‍🔧</VendorIcon>
                <VendorTitle>Assigned Vendor</VendorTitle>
              </VendorHeader>
              <VendorCard>
                <VendorImage
                  src={booking.vendor.photo}
                  alt={booking.vendor.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80x80?text=Vendor'
                  }}
                />
                <VendorInfo>
                  <VendorDetail>
                    <VendorLabel>Name</VendorLabel>
                    <VendorValue>{booking.vendor.name}</VendorValue>
                  </VendorDetail>
                  <VendorDetail>
                    <VendorLabel>Contact</VendorLabel>
                    <VendorValue>{booking.vendor.contact}</VendorValue>
                  </VendorDetail>
                  <VendorDetail>
                    <VendorLabel>Category</VendorLabel>
                    <VendorValue>{booking.vendor.category}</VendorValue>
                  </VendorDetail>
                </VendorInfo>
              </VendorCard>
            </VendorSection>
          )}

          {statusMessage && (
            <StatusMessage
              type={statusMessage.type}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.7 }}
            >
              <StatusEmoji>{getStatusIcon(booking.status)}</StatusEmoji>
              {statusMessage.message}
            </StatusMessage>
          )}
        </BookingCard>
      </ContentWrapper>
    </Container>
  )
}

export default BookingDetails
