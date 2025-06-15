import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { format, isAfter, isBefore, isToday, subWeeks, subMonths } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import api from '@/services/api'

const BookingsContainer = styled.div`
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
  position: relative;
  z-index: 1;
  /* max-width: 1200px; */
  margin: 0 auto;
`

const BookingsCard = styled(motion.div)`
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

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
`

const Title = styled(motion.h1)`
  font-size: 2.25rem;
  font-weight: 800;
  text-align: center;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  margin: 0;

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

const StatsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

const StatCard = styled(motion.div)`
  background: rgba(102, 126, 234, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(102, 126, 234, 0.2);
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }

  h3 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    color: #667eea;
  }

  p {
    margin: 0;
    color: #6b7280;
    font-weight: 500;
  }
`

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.1);
`

const ControlsLeft = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
`

const ControlsRight = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
`

const SearchInput = styled(motion.input)`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: #1f2937;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`

const FilterSelect = styled(motion.select)`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: #1f2937;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`

const SortButton = styled(motion.button)`
  padding: 0.75rem 1rem;
  background: ${(props) =>
    props.active
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'rgba(255, 255, 255, 0.8)'};
  color: ${(props) => (props.active ? 'white' : '#374151')};
  border: 2px solid ${(props) => (props.active ? '#667eea' : '#e5e7eb')};
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    border-color: #667eea;
    transform: translateY(-1px);
  }
`

const BookingsGrid = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
`

const BookingCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1);
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

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`

const BookingNumber = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
`

const BookingDate = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`

const ServicesContainer = styled.div`
  margin-bottom: 1rem;
`

const ServicesLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`

const ServiceTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const ServiceTag = styled.span`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(102, 126, 234, 0.2);
`

const BookingDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
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

const ViewButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
  }
`

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`

const PaginationButton = styled(motion.button)`
  padding: 0.75rem 1rem;
  background: ${(props) =>
    props.active
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'rgba(255, 255, 255, 0.8)'};
  color: ${(props) => (props.active ? 'white' : '#374151')};
  border: 2px solid ${(props) => (props.active ? '#667eea' : '#e5e7eb')};
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 44px;

  &:hover:not(:disabled) {
    border-color: #667eea;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;

  div {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(102, 126, 234, 0.2);
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const MyBookings = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [customerFilter, setCustomerFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const res = await api.get('/service/my-bookings')
      return res.data.bookings
    },
  })

  const filteredAndSortedBookings = useMemo(() => {
    if (!data) return []

    let filtered = [...data]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.services.some((service) =>
            service.toLowerCase().includes(searchTerm.toLowerCase())
          ) || booking.additionalServices?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate)
        switch (dateFilter) {
          case 'today':
            return isToday(bookingDate)
          case 'week':
            return isAfter(bookingDate, subWeeks(now, 1))
          case 'month':
            return isAfter(bookingDate, subMonths(now, 1))
          case 'upcoming':
            return isAfter(bookingDate, now)
          case 'past':
            return isBefore(bookingDate, now)
          default:
            return true
        }
      })
    }

    // Customer filter
    if (customerFilter !== 'all') {
      filtered = filtered.filter((booking) =>
        customerFilter === 'new' ? booking.newCustomer : !booking.newCustomer
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'date-asc':
          return new Date(a.bookingDate) - new Date(b.bookingDate)
        case 'date-desc':
          return new Date(b.bookingDate) - new Date(a.bookingDate)
        default:
          return 0
      }
    })

    return filtered
  }, [data, searchTerm, dateFilter, customerFilter, sortBy])

  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedBookings.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedBookings, currentPage])

  const totalPages = Math.ceil(filteredAndSortedBookings.length / itemsPerPage)

  const stats = useMemo(() => {
    if (!data) return { total: 0, upcoming: 0, completed: 0, newCustomers: 0 }

    const now = new Date()
    return {
      total: data.length,
      upcoming: data.filter((b) => isAfter(new Date(b.bookingDate), now)).length,
      completed: data.filter((b) => isBefore(new Date(b.bookingDate), now)).length,
      newCustomers: data.filter((b) => b.newCustomer).length,
    }
  }, [data])

  if (isError) {
    toast.error(error?.response?.data?.message || 'Error loading bookings')
  }

  return (
    <BookingsContainer>
      <ContentWrapper>
        <BookingsCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Header>
            <Title
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              My Bookings
            </Title>

            {!isLoading && data && (
              <StatsGrid
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <StatCard whileHover={{ y: -4 }}>
                  <h3>{stats.total}</h3>
                  <p>Total Bookings</p>
                </StatCard>
                <StatCard whileHover={{ y: -4 }}>
                  <h3>{stats.upcoming}</h3>
                  <p>Upcoming</p>
                </StatCard>
                <StatCard whileHover={{ y: -4 }}>
                  <h3>{stats.completed}</h3>
                  <p>Completed</p>
                </StatCard>
                {/* <StatCard whileHover={{ y: -4 }}>
                  <h3>{stats.newCustomers}</h3>
                  <p>New Customers</p>
                </StatCard> */}
              </StatsGrid>
            )}
          </Header>

          {isLoading ? (
            <LoadingSpinner>
              <div />
            </LoadingSpinner>
          ) : data?.length === 0 ? (
            <EmptyState initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <h3>No Bookings Yet</h3>
              <p>You haven't made any bookings yet. Start by booking your first service!</p>
              <ViewButton
                onClick={() => navigate('/dashboard/book-service')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book a Service
              </ViewButton>
            </EmptyState>
          ) : (
            <>
              <Controls>
                <ControlsLeft>
                  <SearchInput
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    whileFocus={{ scale: 1.02 }}
                  />
                  <FilterSelect
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </FilterSelect>
                  <FilterSelect
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value)}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option value="all">All Customers</option>
                    <option value="new">New Customers</option>
                    <option value="existing">Existing Customers</option>
                  </FilterSelect>
                </ControlsLeft>
                <ControlsRight>
                  <SortButton
                    active={sortBy === 'newest'}
                    onClick={() => setSortBy('newest')}
                    whileHover={{ scale: 1.05 }}
                  >
                    Newest First
                  </SortButton>
                  <SortButton
                    active={sortBy === 'date-asc'}
                    onClick={() => setSortBy('date-asc')}
                    whileHover={{ scale: 1.05 }}
                  >
                    Date ↑
                  </SortButton>
                  <SortButton
                    active={sortBy === 'date-desc'}
                    onClick={() => setSortBy('date-desc')}
                    whileHover={{ scale: 1.05 }}
                  >
                    Date ↓
                  </SortButton>
                </ControlsRight>
              </Controls>

              <BookingsGrid>
                <AnimatePresence mode="popLayout">
                  {paginatedBookings.map((booking, idx) => (
                    <BookingCard
                      key={booking._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: idx * 0.1 }}
                      layout
                    >
                      <BookingHeader>
                        <BookingNumber>
                          #
                          {((currentPage - 1) * itemsPerPage + idx + 1).toString().padStart(3, '0')}
                        </BookingNumber>
                        <BookingDate>
                          Booked: {format(new Date(booking.createdAt), 'dd MMM yyyy')}
                        </BookingDate>
                      </BookingHeader>

                      <ServicesContainer>
                        <ServicesLabel>Services</ServicesLabel>
                        <ServiceTags>
                          {booking.services.map((service, i) => (
                            <ServiceTag key={i}>{service}</ServiceTag>
                          ))}
                        </ServiceTags>
                      </ServicesContainer>

                      <BookingDetails>
                        <DetailItem>
                          <span>Booking Date</span>
                          <span>{format(new Date(booking.bookingDate), 'dd MMM yyyy')}</span>
                        </DetailItem>
                        <DetailItem>
                          <span>Customer Type</span>
                          <span>{booking.newCustomer ? 'New Customer' : 'Existing Customer'}</span>
                        </DetailItem>
                        {booking.additionalServices && (
                          <DetailItem>
                            <span>Additional Services</span>
                            <span>{booking.additionalServices}</span>
                          </DetailItem>
                        )}
                      </BookingDetails>

                      <ViewButton
                        onClick={() => navigate(`/booking/${booking._id}`)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Details
                      </ViewButton>
                    </BookingCard>
                  ))}
                </AnimatePresence>
              </BookingsGrid>

              {totalPages > 1 && (
                <Pagination>
                  <PaginationButton
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    whileHover={{ scale: 1.05 }}
                  >
                    ← Prev
                  </PaginationButton>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span style={{ color: '#6b7280' }}>...</span>
                        )}
                        <PaginationButton
                          active={currentPage === page}
                          onClick={() => setCurrentPage(page)}
                          whileHover={{ scale: 1.05 }}
                        >
                          {page}
                        </PaginationButton>
                      </React.Fragment>
                    ))}

                  <PaginationButton
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    whileHover={{ scale: 1.05 }}
                  >
                    Next →
                  </PaginationButton>
                </Pagination>
              )}
            </>
          )}
        </BookingsCard>
      </ContentWrapper>
    </BookingsContainer>
  )
}

export default MyBookings
