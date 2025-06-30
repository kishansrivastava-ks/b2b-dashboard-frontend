/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import styled from 'styled-components'
import axios from 'axios'
import toast from 'react-hot-toast'
import Modal from '@/components/Modal'
import ConfirmActionModal from '@/components/ConfirmActionModal'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner'

const GET_USER_BOOKINGS_URL = 'http://localhost:4000/api/service/my-bookings'
const GET_QUOTATION_URL = (bookingId) =>
  `http://localhost:4000/api/service/get-quotation/${bookingId}`
const UPDATE_QUOTATION_STATUS_URL = (bookingId) => `http://localhost:4000/api/service/${bookingId}`

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
      <CenterWrapper>
        <p>Loading your quotations...</p>
      </CenterWrapper>
    )
  }

  if (isError) {
    return <CenterWrapper>Error fetching quotations</CenterWrapper>
  }

  return (
    <Container>
      <h2>Your Quotations</h2>
      {data?.length === 0 ? (
        <CenterWrapper>No bookings found.</CenterWrapper>
      ) : (
        <Grid>
          {console.log('booking data', data)}
          {data.map((booking) => (
            <Card key={booking._id}>
              <h3>{booking.services.join(', ')}</h3>
              <p>Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
              <p>Additional Notes: {booking.additionalServices}</p>

              <QuotationSection>
                <strong>Quotation:</strong>
                <div>
                  <button disabled={!booking.quotation} onClick={() => openQuotation(booking._id)}>
                    View Quotation
                  </button>
                </div>
                <div>
                  {booking.quotationApproved === true ? (
                    <Status accepted>Accepted</Status>
                  ) : booking.quotationApproved === false ? (
                    <Status>Rejected</Status>
                  ) : (
                    <>
                      <button
                        onClick={() => confirmAction('accept', booking)}
                        disabled={isSubmittingAction}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => confirmAction('reject', booking)}
                        disabled={isSubmittingAction}
                        style={{ marginLeft: '8px' }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </QuotationSection>
            </Card>
          ))}
        </Grid>
      )}

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

      {/* Confirm Action Modal - FIXED */}
      <ConfirmActionModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        actionType={actionType}
        onConfirm={performAction}
        isSubmitting={isSubmittingAction}
      />
    </Container>
  )
}

export default QuotationsPage

// Styled Components
const Container = styled.div`
  padding: 2rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
  background: #fff;
`

const QuotationSection = styled.div`
  margin-top: 1rem;
  > div {
    margin-top: 0.5rem;
  }
`

const Status = styled.span`
  padding: 6px 12px;
  border-radius: 4px;
  background-color: ${(props) => (props.accepted ? '#d4edda' : '#f8d7da')};
  color: ${(props) => (props.accepted ? '#155724' : '#721c24')};
  font-weight: bold;
`

const CenterWrapper = styled.div`
  text-align: center;
  padding: 2rem;
`
