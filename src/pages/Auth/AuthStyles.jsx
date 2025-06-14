import { motion } from 'framer-motion'
import styled from 'styled-components'

export const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.light} 0%, #f8f9fa 100%);
  position: relative;
  overflow: hidden;
`

export const FormContainer = styled(motion.div)`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px; /* Add padding for mobile */
`

export const Form = styled(motion.form)`
  width: 100%;
  padding: ${({ theme }) => theme.space.xl};
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.space.md};
    box-shadow: none;
    border-radius: 0;
    background-color: transparent;
  }
`

export const Title = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.dark};
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.lg};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.fontSizes.md};
    margin-bottom: ${({ theme }) => theme.space.md};
  }
`

export const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.space.md};
  position: relative;
`

export const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.space.xs};
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.dark};
`

export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid ${({ theme, error }) => (error ? theme.colors.danger : theme.colors.muted)};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.15);
  }

  &::placeholder {
    color: #adb5bd;
  }

  @media (max-width: 768px) {
    /* padding: ${({ theme }) => theme.space.sm}; */
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`

export const ErrorMessage = styled(motion.p)`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space.xs};
  display: flex;
  align-items: center;

  &:before {
    content: '⚠️';
    margin-right: ${({ theme }) => theme.space.xs};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`

export const Button = styled(motion.button)`
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;

  &:hover {
    background-color: #0051b3;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    background-color: #adb5bd;
    cursor: not-allowed;
    transform: translateY(0);
    box-shadow: none;
  }
`

export const SpinnerWrapper = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  position: relative;
`

export const SpinnerRing = styled.div`
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export const Footer = styled.div`
  margin-top: ${({ theme }) => theme.space.lg};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.darkGray};
`
export const Spinner = () => (
  <SpinnerWrapper>
    <SpinnerRing />
  </SpinnerWrapper>
)
