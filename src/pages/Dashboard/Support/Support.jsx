import React, { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import {
  Search,
  BookOpen,
  UserCheck,
  User,
  IndianRupee,
  Info,
  MessageCircle,
  Phone,
  PhoneCall,
  Mail,
  ChevronRight,
} from 'lucide-react'

const SupportPageContainer = styled.div`
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

const SupportContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 3rem;
  width: 100%;
  margin: 0 auto;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
`

const SupportHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
`

const SupportTitle = styled(motion.h1)`
  font-size: 2.75rem;
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
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
`

const SearchSection = styled(motion.div)`
  margin-bottom: 4rem;
`

const SearchContainer = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
`

const SearchInput = styled(motion.input)`
  width: 100%;
  padding: 1.25rem 1.5rem 1.25rem 3.5rem;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 20px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #6b7280;
  }
`

const SearchIcon = styled.div`
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  pointer-events: none;
`

const BrowseSection = styled(motion.div)`
  margin-bottom: 4rem;
`

const BrowseTitle = styled(motion.h2)`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: #1f2937;
`

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`

const SupportCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px 20px 0 0;
  }
`

const CardIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;

  svg {
    width: 28px;
    height: 28px;
    color: #667eea;
  }
`

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`

const ReadMoreButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:hover {
    color: #764ba2;
    transform: translateX(2px);
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(2px);
  }
`

const ContactSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px 20px 0 0;
  }
`

const ContactTitle = styled(motion.h2)`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: #1f2937;
`

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`

const ContactCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;

  &:hover {
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`

const ContactIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;

  svg {
    width: 22px;
    height: 22px;
    color: #667eea;
  }
`

const ContactMethod = styled.div`
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
`

const ContactValue = styled.div`
  color: #1f2937;
  font-size: 1rem;
  font-weight: 500;
  word-break: break-word;
`

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const supportCategories = [
    {
      title: 'Regarding Booking',
      icon: BookOpen,
      id: 'booking',
    },
    {
      title: 'How to Get Onboarded',
      icon: UserCheck,
      id: 'onboarding',
    },
    {
      title: 'Accounts and Login',
      icon: User,
      id: 'accounts',
    },
    {
      title: 'Prices',
      icon: IndianRupee,
      id: 'prices',
    },
    {
      title: 'About Us',
      icon: Info,
      id: 'about',
    },
    {
      title: 'Register A Complaint',
      icon: MessageCircle,
      id: 'complaint',
    },
  ]

  const contactOptions = [
    {
      method: 'Through IVR',
      value: '8860887541',
      icon: Phone,
    },
    {
      method: 'Through Direct Call',
      value: '9821212667',
      icon: PhoneCall,
    },
    {
      method: 'Through Email',
      value: 'complaints@repaireze.com',
      icon: Mail,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  const handleReadMore = (categoryId) => {
    // Navigate to specific category page
    console.log(`Navigate to ${categoryId} page`)
  }

  return (
    <SupportPageContainer>
      <SupportContainer variants={containerVariants} initial="hidden" animate="visible">
        <SupportHeader variants={itemVariants}>
          <SupportTitle variants={itemVariants}>Welcome to Support Center</SupportTitle>
        </SupportHeader>

        <SearchSection variants={itemVariants}>
          <SearchContainer>
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search for FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              whileFocus={{ scale: 1.02 }}
            />
          </SearchContainer>
        </SearchSection>

        <BrowseSection variants={itemVariants}>
          <BrowseTitle variants={itemVariants}>Browse Support Center</BrowseTitle>

          <CardsGrid>
            {supportCategories.map((category, index) => (
              <SupportCard
                key={category.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CardIcon>
                  <category.icon />
                </CardIcon>
                <CardTitle>{category.title}</CardTitle>
                <ReadMoreButton
                  onClick={() => handleReadMore(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Read More
                  <ChevronRight />
                </ReadMoreButton>
              </SupportCard>
            ))}
          </CardsGrid>
        </BrowseSection>

        <ContactSection variants={itemVariants}>
          <ContactTitle variants={itemVariants}>Need More Help?</ContactTitle>

          <ContactGrid>
            {contactOptions.map((contact, index) => (
              <ContactCard key={index} variants={itemVariants} whileHover={{ scale: 1.02 }}>
                <ContactIcon>
                  <contact.icon />
                </ContactIcon>
                <ContactMethod>{contact.method}</ContactMethod>
                <ContactValue>{contact.value}</ContactValue>
              </ContactCard>
            ))}
          </ContactGrid>
        </ContactSection>
      </SupportContainer>
    </SupportPageContainer>
  )
}

export default Support
