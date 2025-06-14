/* eslint-disable no-unused-vars */
import { useForm } from 'react-hook-form'
import {
  Button,
  Container,
  ErrorMessage,
  Footer,
  Form,
  FormContainer,
  FormGroup,
  Input,
  Label,
  Spinner,
  Title,
} from './AuthStyles.jsx'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const { signup, isAuthenticated } = useAuth()

  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      const response = await signup({
        name: data.name,
        contact: data.contact,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })

      toast.success('Signed Up successfully! Navigating to login page...')

      navigate('/login')
      setTimeout(() => {}, 1000)
    } catch (error) {
      console.error('Error signing up user:', error)
      toast.error(error.message || 'Error signing up user. Please try again or contact support')
    }
  }

  if (isAuthenticated) {
    navigate('/dashboard/profile')
    return
  }

  return (
    <Container>
      <FormContainer>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Title>Get Started with us!</Title>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              error={errors.name}
              {...register('name')}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="contact">Contact</Label>
            <Input
              id="contact"
              type="text"
              placeholder="Enter your contact number"
              error={errors.contact}
              {...register('contact')}
            />
            {errors.contact && <ErrorMessage>{errors.contact.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              error={errors.email}
              {...register('email')}
            />
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              error={errors.password}
              {...register('password')}
            />
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
            )}
          </FormGroup>

          <Button
            type="submit"
            disabled={isSubmitting}
            whileTap={{
              scale: 0.98,
            }}
          >
            {isSubmitting ? (
              <>
                <Spinner /> {`Signing Up`}
              </>
            ) : (
              'Submit'
            )}
          </Button>

          <Footer>
            © {new Date().getFullYear()} Mendt Technologies Pvt. Ltd. All rights reserved.
          </Footer>
          <Footer>
            Already have an account? <Link to="/login">Login</Link>
          </Footer>
        </Form>
      </FormContainer>
    </Container>
  )
}

export default SignUp
