import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

// Pages (lazy-loaded)
const LoginSignup = lazy(() => import('../pages/Auth/AuthPage'))
// const Dashboard = lazy(() => import('../pages/Dashboard'))
// const NotFound = lazy(() => import('../pages/NotFound'))

export const routes = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginSignup />,
  },
  //   {
  //     path: '/dashboard',
  //     element: <Dashboard />,
  //   },
  //   {
  //     path: '*',
  //     element: <NotFound />,
  //   },
]
