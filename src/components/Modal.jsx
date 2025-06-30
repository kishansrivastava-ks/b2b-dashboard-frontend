import React from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children, footerContent, width = '600px' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Backdrop
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContainer
            as={motion.div}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{ width }}
          >
            <Header>
              <h2>{title}</h2>
              <CloseButton onClick={onClose}>
                <X size={20} />
              </CloseButton>
            </Header>
            <Content>{children}</Content>
            {footerContent && <Footer>{footerContent}</Footer>}
          </ModalContainer>
        </Backdrop>
      )}
    </AnimatePresence>
  )
}

export default Modal

// Styled Components
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const Header = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 1.1rem;
  background-color: #f9f9f9;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #444;

  &:hover {
    color: #000;
  }
`

const Content = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`

const Footer = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background-color: #f9f9f9;
`
