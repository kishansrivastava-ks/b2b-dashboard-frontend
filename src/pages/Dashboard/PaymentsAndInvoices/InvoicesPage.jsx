import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'react-hot-toast'
import api from '@/services/api'

function InvoicesPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [invoiceUrl, setInvoiceUrl] = useState(null)
  const [isInvoiceLoading, setIsInvoiceLoading] = useState(false)

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        setLoading(true)
        const response = await api.get('/service/my-bookings')
        const completedWithInvoice = response.data.bookings.filter(
          (b) => b.status === 'completed' && b.invoice
        )
        setBookings(completedWithInvoice)
      } catch (err) {
        setError('Could not load your invoices. Please try again later.')
        toast.error('Could not load your invoices.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMyBookings()
  }, [])

  const handleViewInvoice = async (bookingId) => {
    setIsModalOpen(true)
    setIsInvoiceLoading(true)
    setInvoiceUrl(null)
    try {
      const response = await api.get(`/service/get-invoice/${bookingId}`, {
        responseType: 'blob',
      })
      const file = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/pdf',
      })
      const fileURL = URL.createObjectURL(file)
      setInvoiceUrl(fileURL)
    } catch (err) {
      toast.error('Failed to retrieve invoice.')
      console.error(err)
      setIsModalOpen(false)
    } finally {
      setIsInvoiceLoading(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    if (invoiceUrl) {
      URL.revokeObjectURL(invoiceUrl)
    }
    setInvoiceUrl(null)
  }

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        loop: Infinity,
        ease: 'linear',
        duration: 1,
      },
    },
  }

  const tableVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: 'easeOut',
      },
    }),
  }

  return (
    <PageContainer>
      <Toaster position="top-right" />
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          My Invoices
        </Title>

        {loading ? (
          <LoadingWrapper>
            <LoadingSpinner variants={spinnerVariants} animate="animate" />
          </LoadingWrapper>
        ) : error ? (
          <ErrorWrapper>{error}</ErrorWrapper>
        ) : bookings.length === 0 ? (
          <EmptyState
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3>No Invoices Found</h3>
            <p>
              It looks like you don't have any completed bookings with an invoice yet. Once a
              service is completed and the invoice is generated, it will appear here.
            </p>
          </EmptyState>
        ) : (
          <TableContainer variants={tableVariants} initial="hidden" animate="visible">
            <TableHeader>
              Invoice History ({bookings.length} {bookings.length === 1 ? 'Invoice' : 'Invoices'})
            </TableHeader>

            <ResponsiveWrapper>
              <Table>
                <TableHead>
                  <tr>
                    <TableHeaderCell>Booking ID</TableHeaderCell>
                    <TableHeaderCell>Services</TableHeaderCell>
                    <TableHeaderCell>Booking Date</TableHeaderCell>
                    <TableHeaderCell>Completed On</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Action</TableHeaderCell>
                  </tr>
                </TableHead>
                <TableBody>
                  {bookings.map((booking, i) => (
                    <TableRow
                      key={booking._id}
                      custom={i}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <TableCell>#{booking._id.slice(-8).toUpperCase()}</TableCell>
                      <ServiceCell>{booking.services.join(' & ')}</ServiceCell>
                      <TableCell>
                        {new Date(booking.bookingDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        {new Date(booking.updatedAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <StatusBadge>Completed</StatusBadge>
                      </TableCell>
                      <TableCell>
                        <ViewButton
                          onClick={() => handleViewInvoice(booking._id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Invoice
                        </ViewButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ResponsiveWrapper>

            <TableSummary>Showing all completed bookings with generated invoices</TableSummary>
          </TableContainer>
        )}
      </ContentWrapper>

      <AnimatePresence>
        {isModalOpen && (
          <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <CloseButton onClick={closeModal}>&times;</CloseButton>
              {isInvoiceLoading ? (
                <ModalLoadingSpinner variants={spinnerVariants} animate="animate" />
              ) : (
                invoiceUrl && <Iframe src={invoiceUrl} title="Invoice Viewer" />
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  )
}

export default InvoicesPage

const PageContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* background: white; */
  padding: 2rem;
  /* border: 2px solid red; */
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
`

const ContentWrapper = styled.div`
  /* max-width: 1400px; */
  background: white;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100%;
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

const TableContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

const TableHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
`

const TableHead = styled.thead`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
`

const TableHeaderCell = styled.th`
  padding: 1.2rem 1.5rem;
  text-align: left;
  font-weight: 700;
  color: #374151;
  border-bottom: 2px solid rgba(102, 126, 234, 0.2);
  position: relative;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.05em;

  &:first-child {
    border-top-left-radius: 12px;
  }

  &:last-child {
    border-top-right-radius: 12px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
`

const TableBody = styled.tbody`
  tr:nth-child(even) {
    background: rgba(102, 126, 234, 0.03);
  }
`

const TableRow = styled(motion.tr)`
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
    transform: scale(1.01);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
  }
`

const TableCell = styled.td`
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  color: #374151;
  font-weight: 500;
  vertical-align: middle;

  &:first-child {
    font-weight: 600;
    color: #1e293b;
  }
`

const ServiceCell = styled(TableCell)`
  font-weight: 600;
  color: #667eea;
  max-width: 200px;
`

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
`

const ViewButton = styled(motion.button)`
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  color: #6b7280;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #374151;
  }

  p {
    font-size: 1.1rem;
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.6;
  }
`

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`

const LoadingSpinner = styled(motion.div)`
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top: 5px solid #fff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
`

const ErrorWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  background: rgba(255, 100, 100, 0.1);
  border: 1px solid rgba(255, 100, 100, 0.3);
  border-radius: 20px;
  color: #ef4444;
  font-size: 1.2rem;
  font-weight: 500;
  backdrop-filter: blur(15px);
`

const TableSummary = styled.div`
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  border-top: 1px solid rgba(102, 126, 234, 0.1);
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
`

// --- MODAL STYLED COMPONENTS ---
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  width: 90%;
  height: 90%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
`

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  background: transparent;
  border: none;
  font-size: 2.5rem;
  color: #555;
  cursor: pointer;
  transition: color 0.2s;
  z-index: 1001;

  &:hover {
    color: #000;
  }
`

const Iframe = styled.iframe`
  flex-grow: 1;
  border: 1px solid #ddd;
  border-radius: 12px;
  margin-top: 1rem;
`

const ModalLoadingSpinner = styled(motion.div)`
  border: 6px solid #f3f3f3;
  border-top: 6px solid #667eea;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

// Responsive wrapper for mobile
const ResponsiveWrapper = styled.div`
  @media (max-width: 768px) {
    overflow-x: auto;

    ${Table} {
      min-width: 700px;
    }

    ${TableCell}, ${TableHeaderCell} {
      padding: 1rem;
      font-size: 0.85rem;
    }

    ${ServiceCell} {
      max-width: 150px;
    }
  }
`
