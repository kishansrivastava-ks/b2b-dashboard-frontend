/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import styled from 'styled-components'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogOutIcon, MenuIcon, UserIcon, ChevronRightIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
`

const SidebarContainer = styled(motion.div)`
  width: ${(props) => (props.collapsed ? '80px' : '280px')};
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 10;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
`

const SidebarContent = styled.div`
  padding: 2rem 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
`

const Logo = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  opacity: ${(props) => (props.collapsed ? 0 : 1)};
  transition: opacity 0.2s ease;
`

const ToggleButton = styled(motion.button)`
  background: rgba(102, 126, 234, 0.1);
  border: none;
  border-radius: 12px;
  padding: 0.75rem;
  cursor: pointer;
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.2);
    transform: scale(1.05);
  }
`

const Navigation = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 1rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  border-radius: 16px;
  position: relative;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  gap: 1rem;
  overflow: hidden;

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.08);
    transform: translateX(4px);
  }

  &.active {
    color: #667eea;
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.15) 0%,
      rgba(118, 75, 162, 0.15) 100%
    );
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 60%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 0 4px 4px 0;
    }
  }

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }
`

const NavText = styled(motion.span)`
  white-space: nowrap;
  overflow: hidden;
`

const NavArrow = styled(motion.div)`
  margin-left: auto;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.2s ease;

  ${NavItem}:hover & {
    opacity: 1;
    transform: translateX(0);
  }

  ${NavItem}.active & {
    opacity: 1;
    transform: translateX(0);
  }
`

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const Header = styled(motion.header)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
`

const HeaderTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const UserAvatar = styled(motion.div)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
`

const MainContent = styled(motion.main)`
  flex: 1;
  /* padding: 2rem; */
  /* background: rgba(255, 255, 255, 0.5); */
  backdrop-filter: blur(10px);
  overflow-y: auto;

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

const LogoutButton = styled(motion.button)`
  padding: 1rem;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
  color: #ef4444;
  font-weight: 600;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.collapsed ? 'center' : 'flex-start')};
  gap: 1rem;
  margin-top: auto;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`

const LogoutText = styled(motion.span)`
  white-space: nowrap;
  overflow: hidden;
`

const DashboardLayout = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      toast.error('Failed to logout. Please try again.')
    }
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <LayoutContainer>
      <SidebarContainer
        collapsed={sidebarCollapsed}
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <SidebarContent>
          <SidebarHeader>
            <Logo collapsed={sidebarCollapsed}>Dashboard</Logo>
            <ToggleButton
              onClick={toggleSidebar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MenuIcon size={20} />
            </ToggleButton>
          </SidebarHeader>

          <Navigation>
            <NavItem to="/dashboard/profile">
              <UserIcon />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <NavText
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    Profile
                  </NavText>
                )}
              </AnimatePresence>
              {!sidebarCollapsed && (
                <NavArrow>
                  <ChevronRightIcon size={16} />
                </NavArrow>
              )}
            </NavItem>
          </Navigation>

          <LogoutButton
            collapsed={sidebarCollapsed}
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOutIcon />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <LogoutText
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  Logout
                </LogoutText>
              )}
            </AnimatePresence>
          </LogoutButton>
        </SidebarContent>
      </SidebarContainer>

      <MainContainer>
        <Header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <HeaderTitle>Welcome to Your Dashboard</HeaderTitle>
          <HeaderActions>
            <UserAvatar whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <UserIcon size={20} />
            </UserAvatar>
          </HeaderActions>
        </Header>

        <MainContent
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Outlet />
        </MainContent>
      </MainContainer>
    </LayoutContainer>
  )
}

export default DashboardLayout
