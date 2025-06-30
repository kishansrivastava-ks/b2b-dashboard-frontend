/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import Modal from '@/components/Modal'
import ConfirmActionModal from '@/components/ConfirmActionModal'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner'

// Styled Components
const QuotationsContainer = styled.div`
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
`

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  /* max-width: 1200px; */
  margin: 0 auto;
`

const QuotationsCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  /* border-radius: 24px; */
  padding: 2rem;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
`

const Title = styled(motion.h2)`
  font-size: 2.25rem;
  font-weight: 800;
  text-align: center;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  margin: 0 0 3rem 0;

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

const QuotationsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const QuotationCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.95);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  }
`

const QuotationHeader = styled.div`
  margin-bottom: 1.5rem;
`

const ServiceTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem 0;
  line-height: 1.4;
`

const QuotationDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const DetailItem = styled.div`
  span:first-child {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.25rem;
  }

  span:last-child {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    color: #374151;
  }
`

const QuotationSection = styled.div`
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(102, 126, 234, 0.1);
  margin-top: 1rem;

  strong {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
    display: block;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`

const ViewButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: ${(props) =>
    props.disabled
      ? 'rgba(156, 163, 175, 0.5)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) => (props.disabled ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.3)')};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
  }
`

const ActionButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: ${(props) => {
    if (props.disabled) return 'rgba(156, 163, 175, 0.5)'
    return props.variant === 'accept'
      ? 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'
      : 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)'
  }};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) => {
    if (props.disabled) return 'none'
    return props.variant === 'accept'
      ? '0 4px 15px rgba(52, 211, 153, 0.3)'
      : '0 4px 15px rgba(248, 113, 113, 0.3)'
  }};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${(props) => {
      return props.variant === 'accept'
        ? '0 6px 25px rgba(52, 211, 153, 0.4)'
        : '0 6px 25px rgba(248, 113, 113, 0.4)'
    }};
  }
`

const StatusBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  margin-top: 1rem;

  ${(props) => {
    if (props.accepted === true) {
      return `
        background: linear-gradient(135deg, #34d399, #10b981);
        color: white;
        box-shadow: 0 2px 8px rgba(52, 211, 153, 0.3);
      `
    } else if (props.accepted === false) {
      return `
        background: linear-gradient(135deg, #f87171, #ef4444);
        color: white;
        box-shadow: 0 2px 8px rgba(248, 113, 113, 0.3);
      `
    }
    return `
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      color: white;
      box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
    `
  }}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #374151;
  }

  p {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 500;
`

const ErrorWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: #ef4444;
  font-size: 1.1rem;
  font-weight: 500;
`

// Component
const QuotationsPage = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [actionType, setActionType] = useState(null) // 'accept' or 'reject'
  const [isSubmittingAction, setIsSubmittingAction] = useState(false)

  const [quotationModalOpen, setQuotationModalOpen] = useState(false)
  const [quotationLoading, setQuotationLoading] = useState(false)
  const [quotationBlobUrl, setQuotationBlobUrl] = useState(null)

  const {
    data,
    isLoading: isBookingsLoading,
    isError,
  } = useQuery({
    queryKey: ['userBookings'],
    queryFn: async () => {
      const res = await api.get('/service/my-bookings')
      return res.data.bookings
    },
  })

  const mutation = useMutation({
    mutationFn: async ({ bookingId, status }) => {
      await api.put(`/service/${bookingId}`, {
        quotationApproved: status,
      })
    },
    onSuccess: (_, { status }) => {
      toast.success(`Quotation ${status ? 'accepted' : 'rejected'}`)
      queryClient.invalidateQueries(['userBookings'])
      setIsConfirmModalOpen(false)
      setActionType(null)
      setSelectedBooking(null)
      setIsSubmittingAction(false)
    },
    onError: () => {
      toast.error('Action failed')
      setIsSubmittingAction(false)
    },
  })

  const confirmAction = (type, booking) => {
    console.log('confirmAction called with type:', type, 'and booking:', booking)
    setActionType(type)
    setSelectedBooking(booking)
    setIsConfirmModalOpen(true)
  }

  const performAction = () => {
    console.log(
      'performAction called with selectedBooking:',
      selectedBooking,
      'and actionType:',
      actionType
    )
    if (!selectedBooking || !actionType) return
    setIsSubmittingAction(true)
    mutation.mutate({
      bookingId: selectedBooking._id,
      status: actionType === 'accept',
    })
  }

  const openQuotation = async (serviceId) => {
    setQuotationLoading(true)
    try {
      const res = await api.get(`/service/get-quotation/${serviceId}`, { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      setQuotationBlobUrl(url)
      setQuotationModalOpen(true)
    } catch (err) {
      toast.error('Failed to load quotation')
    } finally {
      setQuotationLoading(false)
    }
  }

  if (isBookingsLoading) {
    return (
      <QuotationsContainer>
        <ContentWrapper>
          <QuotationsCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LoadingWrapper>
              <p>Loading your quotations...</p>
            </LoadingWrapper>
          </QuotationsCard>
        </ContentWrapper>
      </QuotationsContainer>
    )
  }

  if (isError) {
    return (
      <QuotationsContainer>
        <ContentWrapper>
          <QuotationsCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ErrorWrapper>Error fetching quotations</ErrorWrapper>
          </QuotationsCard>
        </ContentWrapper>
      </QuotationsContainer>
    )
  }

  return (
    <QuotationsContainer>
      <ContentWrapper>
        <QuotationsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Your Quotations
          </Title>

          {data?.length === 0 ? (
            <EmptyState
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3>No Quotations Found</h3>
              <p>
                You don't have any quotations yet. Your quotations will appear here once vendors
                submit them.
              </p>
            </EmptyState>
          ) : (
            <QuotationsGrid>
              {console.log('booking data', data)}
              {data.map((booking, index) => (
                <QuotationCard
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ y: -4 }}
                >
                  <QuotationHeader>
                    <ServiceTitle>{booking.services.join(', ')}</ServiceTitle>
                  </QuotationHeader>

                  <QuotationDetails>
                    <DetailItem>
                      <span>Booking Date</span>
                      <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                    </DetailItem>
                    <DetailItem>
                      <span>Additional Notes</span>
                      <span>{booking.additionalServices || 'None'}</span>
                    </DetailItem>
                  </QuotationDetails>

                  <QuotationSection>
                    <strong>Quotation Management</strong>

                    <ButtonGroup>
                      <ViewButton
                        disabled={!booking.quotation}
                        onClick={() => openQuotation(booking._id)}
                        whileHover={!booking.quotation ? {} : { scale: 1.02 }}
                        whileTap={!booking.quotation ? {} : { scale: 0.98 }}
                      >
                        View Quotation
                      </ViewButton>
                    </ButtonGroup>

                    {booking.quotationApproved === true ? (
                      <StatusBadge accepted={true}>✓ Accepted</StatusBadge>
                    ) : booking.quotationApproved === false ? (
                      <StatusBadge accepted={false}>✗ Rejected</StatusBadge>
                    ) : (
                      <ButtonGroup>
                        <ActionButton
                          variant="accept"
                          onClick={() => confirmAction('accept', booking)}
                          disabled={isSubmittingAction}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Accept
                        </ActionButton>
                        <ActionButton
                          variant="reject"
                          onClick={() => confirmAction('reject', booking)}
                          disabled={isSubmittingAction}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Reject
                        </ActionButton>
                      </ButtonGroup>
                    )}
                  </QuotationSection>
                </QuotationCard>
              ))}
            </QuotationsGrid>
          )}
        </QuotationsCard>
      </ContentWrapper>

      {/* View Quotation Modal */}
      {quotationModalOpen && (
        <Modal
          isOpen={quotationModalOpen}
          onClose={() => setQuotationModalOpen(false)}
          title="Quotation PDF"
        >
          {quotationLoading ? (
            <LoadingSpinner />
          ) : (
            <iframe
              src={quotationBlobUrl}
              width="100%"
              height="500px"
              style={{ border: 'none' }}
              title="Quotation Preview"
            />
          )}
        </Modal>
      )}

      {/* Confirm Action Modal */}
      <ConfirmActionModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        actionType={actionType}
        onConfirm={performAction}
        isSubmitting={isSubmittingAction}
      />
    </QuotationsContainer>
  )
}

export default QuotationsPage
