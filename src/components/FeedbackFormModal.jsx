// components/FeedbackFormModal.jsx
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/services/api'

const StarRating = ({ selectedStars, onSelect }) => {
  const stars = [1, 2, 3, 4, 5]
  return (
    <StarRatingContainer>
      {stars.map((star) => (
        <Star
          key={star}
          $filled={star <= selectedStars}
          onClick={() => onSelect(star)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          &#9733;
        </Star>
      ))}
    </StarRatingContainer>
  )
}

const FeedbackFormModal = ({ serviceBooking, onClose, onSubmitSuccess }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [timelinessRating, setTimelinessRating] = useState(0)
  const [qualityRating, setQualityRating] = useState(0)
  const [professionalismRating, setProfessionalismRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const feedbackData = {
        serviceBookingId: serviceBooking._id,
        rating,
        comment,
        timelinessRating,
        qualityRating,
        professionalismRating,
      }
      await api.post('/feedback', feedbackData)
      toast.success('Feedback submitted successfully!')
      onSubmitSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Error submitting feedback')
      toast.error(err.response?.data?.message || 'Error submitting feedback')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <ModalContent
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader>
            <HeaderIcon>⭐</HeaderIcon>
            <div>
              <ModalTitle>Support us by sharing your valuable feedback</ModalTitle>
              <ServiceInfo>
                <ServiceName>{serviceBooking.serviceType}</ServiceName>
                <ServiceDate>
                  {new Date(serviceBooking.bookingDate).toLocaleDateString()}
                </ServiceDate>
              </ServiceInfo>
            </div>
            <CloseButton onClick={onClose} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              ×
            </CloseButton>
          </ModalHeader>

          <FormContainer onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel>
                <LabelIcon>🌟</LabelIcon>
                Overall Rating
              </FormLabel>
              <StarRating selectedStars={rating} onSelect={setRating} />
            </FormGroup>

            <RatingGrid>
              <FormGroup>
                <FormLabel>
                  <LabelIcon>⏰</LabelIcon>
                  Timeliness
                </FormLabel>
                <StarRating selectedStars={timelinessRating} onSelect={setTimelinessRating} />
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  <LabelIcon>🎯</LabelIcon>
                  Quality of Work
                </FormLabel>
                <StarRating selectedStars={qualityRating} onSelect={setQualityRating} />
              </FormGroup>

              <FormGroup>
                <FormLabel>
                  <LabelIcon>🤝</LabelIcon>
                  Professionalism
                </FormLabel>
                <StarRating
                  selectedStars={professionalismRating}
                  onSelect={setProfessionalismRating}
                />
              </FormGroup>
            </RatingGrid>

            <FormGroup>
              <FormLabel htmlFor="comment">
                <LabelIcon>💬</LabelIcon>
                Your Comments
              </FormLabel>
              <CommentTextarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                maxLength="500"
                placeholder="Share your detailed experience with the service..."
              />
              <CharacterCount>{comment.length}/500</CharacterCount>
            </FormGroup>

            <AnimatePresence>
              {error && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ErrorIcon>⚠️</ErrorIcon>
                  {error}
                </ErrorMessage>
              )}
            </AnimatePresence>

            <ModalActions>
              <SubmitButton
                type="submit"
                disabled={loading || rating === 0}
                whileHover={{ scale: loading || rating === 0 ? 1 : 1.02 }}
                whileTap={{ scale: loading || rating === 0 ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Submitting...
                  </>
                ) : (
                  <>
                    <ButtonIcon>📝</ButtonIcon>
                    Submit Feedback
                  </>
                )}
              </SubmitButton>
              <CancelButton
                type="button"
                onClick={onClose}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                Cancel
              </CancelButton>
            </ModalActions>
          </FormContainer>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  )
}

export default FeedbackFormModal

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
`

const ModalContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  /* border-radius: 24px; */
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(102, 126, 234, 0.5);
    }
  }
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
`

const HeaderIcon = styled.div`
  font-size: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const ServiceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
`

const ServiceName = styled.span`
  font-weight: 600;
  color: #667eea;
  font-size: 0.9rem;
`

const ServiceDate = styled.span`
  color: #64748b;
  font-size: 0.85rem;
  &::before {
    content: '•';
    margin-right: 0.5rem;
  }
`

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  color: #ef4444;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
  }
`

const FormContainer = styled.form`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
`

const LabelIcon = styled.span`
  font-size: 1rem;
`

const RatingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.1);
`

const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  font-size: 0.95rem;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: rgba(255, 255, 255, 0.95);
  }

  &::placeholder {
    color: #94a3b8;
  }
`

const CharacterCount = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
  align-self: flex-end;
  margin-top: -0.5rem;
`

const StarRatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const Star = styled(motion.span)`
  font-size: 1.75rem;
  color: ${(props) => (props.$filled ? '#ffc107' : '#b6b8bc')};
  cursor: pointer;
  transition: all 0.2s ease;
  text-shadow: ${(props) => (props.$filled ? '0 2px 4px rgba(255, 193, 7, 0.3)' : 'none')};

  &:hover {
    color: #ffc107;
    transform: scale(1.1);
  }
`

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`

const SubmitButton = styled(motion.button)`
  flex: 1;
  min-width: 140px;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  &:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
`

const CancelButton = styled(motion.button)`
  padding: 1rem 1.5rem;
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.2);
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  &:hover:not(:disabled) {
    background: rgba(107, 114, 128, 0.15);
    border-color: rgba(107, 114, 128, 0.3);
  }
`

const ErrorMessage = styled(motion.div)`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 1rem;
  color: #dc2626;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`

const ErrorIcon = styled.span`
  font-size: 1rem;
  flex-shrink: 0;
`

const ButtonIcon = styled.span`
  font-size: 1rem;
`

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
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
