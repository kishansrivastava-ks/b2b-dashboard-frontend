import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { GlobalStyles } from './config/globalStyles'
import { QueryProvider } from './context/QueryProvider'
import { ThemeProvider } from './context/ThemeProvider'
import { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import AuthPage from './pages/Auth/AuthPage'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import DashboardLayout from './layouts/DashboardLayout '
import Profile from './pages/Dashboard/Profile'
import ChangePassword from './pages/Auth/ChangePassword'
import ResetPassword from './pages/Auth/ResetPassword'
import ForgotPasswordRequest from './pages/Auth/ForgotPasswordRequest'
import UpdateProfile from './pages/Dashboard/UpdateProfile'
import BookService from './pages/Dashboard/BookService'
import MyBookings from './pages/Dashboard/MyBookings'
import BookingDetails from './pages/Dashboard/BookingDetails'

const LoadingFallback = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    Loading...
  </div>
)

function App() {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <QueryProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPasswordRequest />} />
                <Route path="/forgot-password/:token" element={<ResetPassword />} />

                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route path="" element={<Profile />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="change-password" element={<ChangePassword />} />
                  <Route path="update-profile" element={<UpdateProfile />} />
                  <Route path="book-service" element={<BookService />} />
                  <Route path="my-bookings" element={<MyBookings />} />
                  <Route path="my-bookings/:bookingId" element={<BookingDetails />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Toaster
            toastOptions={{
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}

export default App
