import React from 'react'
import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const SpinnerContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

const Spinner = styled.div`
  width: ${(props) => props.size || '40px'};
  height: ${(props) => props.size || '40px'};
  border: ${(props) => props.thickness || '4px'} solid ${(props) => props.trackColor || '#f3f3f3'};
  border-top: ${(props) => props.thickness || '4px'} solid ${(props) => props.color || '#3498db'};
  border-radius: 50%;
  animation: ${spin} ${(props) => props.speed || '1s'} linear infinite;
`

const LoadingText = styled.span`
  margin-left: ${(props) => (props.showText ? '12px' : '0')};
  font-size: 14px;
  color: ${(props) => props.textColor || '#666'};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`

const LoadingSpinner = ({
  size = '40px',
  color = '#3498db',
  trackColor = '#f3f3f3',
  thickness = '4px',
  speed = '1s',
  text = 'Loading...',
  showText = false,
  textColor = '#666',
  className = '',
}) => {
  return (
    <SpinnerContainer className={className}>
      <Spinner
        size={size}
        color={color}
        trackColor={trackColor}
        thickness={thickness}
        speed={speed}
      />
      {showText && (
        <LoadingText showText={showText} textColor={textColor}>
          {text}
        </LoadingText>
      )}
    </SpinnerContainer>
  )
}

export default LoadingSpinner
