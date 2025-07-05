// components/FeedbackFormModal.jsx
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import styled from 'styled-components'
import api from '@/services/api'

const StarRating = ({ selectedStars, onSelect }) => {
  const stars = [1, 2, 3, 4, 5]
  return (
    <StarRatingContainer>
      {stars.map((star) => (
        <Star key={star} $filled={star <= selectedStars} onClick={() => onSelect(star)}>
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
    <ModalOverlay>
      <ModalContent>
        <h3>Provide Feedback for {serviceBooking.serviceType}</h3>
        <p>Service Date: {new Date(serviceBooking.bookingDate).toLocaleDateString()}</p>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Overall Rating:</label>
            <StarRating selectedStars={rating} onSelect={setRating} />
          </FormGroup>

          <FormGroup>
            <label>Timeliness:</label>
            <StarRating selectedStars={timelinessRating} onSelect={setTimelinessRating} />
          </FormGroup>
          <FormGroup>
            <label>Quality of Work:</label>
            <StarRating selectedStars={qualityRating} onSelect={setQualityRating} />
          </FormGroup>
          <FormGroup>
            <label>Professionalism of Vendor:</label>
            <StarRating selectedStars={professionalismRating} onSelect={setProfessionalismRating} />
          </FormGroup>

          <FormGroup>
            <label htmlFor="comment">Comment:</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              maxLength="500"
              placeholder="Share your experience..."
            ></textarea>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ModalActions>
            <button type="submit" disabled={loading || rating === 0}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </ModalActions>
        </form>
      </ModalContent>
    </ModalOverlay>
  )
}

export default FeedbackFormModal

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h3 {
    color: #333;
    margin-bottom: 15px;
    text-align: center;
  }

  p {
    color: #666;
    margin-bottom: 20px;
    text-align: center;
  }
`

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #555;
  }

  textarea {
    width: calc(100% - 20px); /* Adjusting for padding */
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    min-height: 80px;
    resize: vertical;
    box-sizing: border-box; /* Include padding in width */

    &:focus {
      border-color: #007bff;
      outline: none;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
  }
`

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 25px;

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  button[type='submit'] {
    background-color: #007bff;
    color: white;

    &:hover:not(:disabled) {
      background-color: #0056b3;
    }
  }

  button[type='button'] {
    /* Cancel button */
    background-color: #6c757d;
    color: white;

    &:hover:not(:disabled) {
      background-color: #5a6268;
    }
  }
`

const ErrorMessage = styled.p`
  color: #dc3545;
  margin-top: 10px;
  text-align: center;
`

const StarRatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

const Star = styled.span`
  font-size: 30px;
  color: ${(props) => (props.$filled ? '#ffc107' : '#e4e5e9')}; /* Use $ for transient props */
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #ffc107;
  }
`
