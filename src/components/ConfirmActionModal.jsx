import React from 'react'
import styled from 'styled-components'
import Modal from './Modal'

const ConfirmActionModal = ({
  isOpen,
  onClose,
  actionType = 'accept',
  onConfirm,
  isSubmitting = false,
}) => {
  const isAccept = actionType === 'accept'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Confirm ${isAccept ? 'Acceptance' : 'Rejection'}`}
      footerContent={
        <FooterActions>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <ConfirmButton onClick={onConfirm} disabled={isSubmitting} $isAccept={isAccept}>
            {isSubmitting ? 'Submitting...' : 'Confirm'}
          </ConfirmButton>
        </FooterActions>
      }
    >
      <Message>Are you sure you want to {isAccept ? 'accept' : 'reject'} this quotation?</Message>
    </Modal>
  )
}

export default ConfirmActionModal

// Styled Components
const Message = styled.p`
  font-size: 1rem;
  margin: 16px 0;
  text-align: center;
`

const FooterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`

const CancelButton = styled.button`
  background: transparent;
  border: 1px solid #aaa;
  color: #555;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #eee;
  }
`

const ConfirmButton = styled.button`
  background: ${({ $isAccept }) => ($isAccept ? '#1e90ff' : '#ff4d4f')};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
