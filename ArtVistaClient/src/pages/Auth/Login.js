import {
    Flex,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    } from '@chakra-ui/react';
  
  import React from 'react';
  import { useNavigate, Link } from 'react-router-dom';
  import { Login } from '../../API/users';
  import { useContext } from 'react';
import { AuthContext } from './authProvider';
  
  export default function LoginPage(){
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) =>{
        event.preventDefault();

        const formData = {
            user_email: event.target.elements.email.value,
            user_password: event.target.elements.password.value,
          };
        
          const response = await Login(formData);

          // setIsAuthenticated(true);

          if (response && response.status) {
            console.log('Successful Login', response.data);
            localStorage.setItem('userToken', response.data.token);
            
            setIsAuthenticated(true);
            navigate('/homePage');
          } else {
            console.log('Login failed in handle submit', response);
          }

    }
      return (
          <>
          <Flex minHeight="100vh" width="full" align="center" justifyContent="center">
              <Box p={2}>
                  <Box textAlign="center">
                      <Heading>Login</Heading>
                  </Box>
                  <Box p={4} textAlign="left">
                    <form onSubmit={handleSubmit}>
                        <FormControl isRequired>
                              <FormLabel>Email</FormLabel>
                              <Input type='email' name='email' placeholder='test@gmail.com' />
                          </FormControl>
                          <FormControl isRequired>
                              <FormLabel>Password</FormLabel>
                              <Input type='password' name='password' placeholder='******' />
                          </FormControl>
                          <Button type='submit'>Log In</Button>
                    </form>
                    <p>Create new account?</p>
                    <p>Sign Up Here</p>
                    <Link to='/signup'>
                        <Button>Sign Up</Button>
                    
                    </Link>
                          
                  </Box>
              </Box>
          </Flex>
              
          </>
      )
  }