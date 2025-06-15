import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { User, Mail, Phone, Building, FileText, Calendar, Settings, Edit } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

const formatDate = (iso) => new Date(iso).toLocaleDateString()

const ProfilePageContainer = styled.div`
  min-height: 70vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
    pointer-events: none;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const ProfileContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  /* border-radius: 24px; */
  padding: 3rem;
  width: 100%;
  /* max-width: 800px; */
  margin: 0 auto;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;

  /* &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 24px 24px 0 0;
  } */
`

const ProfileHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
`

const ProfileTitle = styled(motion.h2)`
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;

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

const ProfileAvatar = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);

  svg {
    width: 32px;
    height: 32px;
    color: white;
  }
`

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const InfoCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
    color: #667eea;
  }
`

const InfoContent = styled.div`
  flex: 1;
`

const Label = styled.div`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
  margin-bottom: 0.25rem;
`

const Value = styled.div`
  color: #1f2937;
  font-size: 1rem;
  font-weight: 500;
  word-break: break-word;
`

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
`

const ActionButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`

const Profile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    toast.error('No user found')
    return null
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <ProfilePageContainer>
      <ProfileContainer variants={containerVariants} initial="hidden" animate="visible">
        <ProfileHeader variants={itemVariants}>
          <ProfileAvatar whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <User />
          </ProfileAvatar>
          <ProfileTitle variants={itemVariants}>Hello, {user.name}</ProfileTitle>
        </ProfileHeader>

        <ProfileGrid>
          <InfoCard variants={itemVariants}>
            <InfoRow>
              <IconWrapper>
                <Mail />
              </IconWrapper>
              <InfoContent>
                <Label>Email Address</Label>
                <Value>{user.email}</Value>
              </InfoContent>
            </InfoRow>
          </InfoCard>

          <InfoCard variants={itemVariants}>
            <InfoRow>
              <IconWrapper>
                <Phone />
              </IconWrapper>
              <InfoContent>
                <Label>Contact Number</Label>
                <Value>{user.contact}</Value>
              </InfoContent>
            </InfoRow>
          </InfoCard>

          <InfoCard variants={itemVariants}>
            <InfoRow>
              <IconWrapper>
                <Building />
              </IconWrapper>
              <InfoContent>
                <Label>Customer Type</Label>
                <Value>{user.customerType}</Value>
              </InfoContent>
            </InfoRow>
          </InfoCard>

          <InfoCard variants={itemVariants}>
            <InfoRow>
              <IconWrapper>
                <FileText />
              </IconWrapper>
              <InfoContent>
                <Label>GST Number</Label>
                <Value>{user.gstNumber || 'Not Provided'}</Value>
              </InfoContent>
            </InfoRow>
          </InfoCard>

          <InfoCard variants={itemVariants}>
            <InfoRow>
              <IconWrapper>
                <User />
              </IconWrapper>
              <InfoContent>
                <Label>Representative Name</Label>
                <Value>{user.representativeName || 'Not Provided'}</Value>
              </InfoContent>
            </InfoRow>
          </InfoCard>

          <InfoCard variants={itemVariants}>
            <InfoRow>
              <IconWrapper>
                <Phone />
              </IconWrapper>
              <InfoContent>
                <Label>Representative Contact</Label>
                <Value>{user.representativeContact || 'Not Provided'}</Value>
              </InfoContent>
            </InfoRow>
          </InfoCard>

          <InfoCard variants={itemVariants}>
            <InfoRow>
              <IconWrapper>
                <Calendar />
              </IconWrapper>
              <InfoContent>
                <Label>Account Created</Label>
                <Value>{formatDate(user.createdAt)}</Value>
              </InfoContent>
            </InfoRow>
          </InfoCard>

          <InfoCard variants={itemVariants}>
            <InfoRow>
              <IconWrapper>
                <Calendar />
              </IconWrapper>
              <InfoContent>
                <Label>Last Updated</Label>
                <Value>{formatDate(user.updatedAt)}</Value>
              </InfoContent>
            </InfoRow>
          </InfoCard>
        </ProfileGrid>

        <ButtonGroup variants={itemVariants}>
          <ActionButton
            onClick={() => navigate('/dashboard/change-password')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Settings />
            Change Password
          </ActionButton>
          <ActionButton
            onClick={() => navigate('/dashboard/update-profile')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Edit />
            Update Profile
          </ActionButton>
        </ButtonGroup>
      </ProfileContainer>
    </ProfilePageContainer>
  )
}

export default Profile
