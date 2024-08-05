import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
`;

const LoginForm = styled.form`
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 300px;
`;

const Title = styled.h2`
    margin-bottom: 20px;
    text-align: center;
`;

const ErrorMessage = styled.p`
    color: red;
    margin-bottom: 10px;
    text-align: center;
`;

const FormGroup = styled.div`
    margin-bottom: 15px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 5px;
`;

const Input = styled.input`
    width: 100%;
    padding: 8px;
    border:black
    box-sizing: border-box;
`;

const Button = styled.button`
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
        background-color: #0056b3;
    }
    
    &:disabled {
        background-color: #007bff;
        cursor: not-allowed;
    }
`;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
          console.log(email, password);
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data?.status) {
                // Handle successful login here (e.g., save token, redirect)
                console.log( data.data);
                localStorage.setItem("userinfo", JSON.stringify(data.data))
                if(data?.data.role === "teacher"){
                  navigate("/teacher-home")
                }
                if(data?.data.role === "student"){
                  navigate("/student-home")
                }
            } else {
                // Handle login error here
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
      if(localStorage.getItem("userinfo")){
        const userinfo = JSON.parse(localStorage.getItem("userinfo"))
        if(userinfo.role === "teacher"){
            navigate("/teacher-home")
        }
        if(userinfo.role === "student"){
            navigate("/student-home")
        }
      }
    
      
    }, [])
    

    return (
        <LoginContainer>
            <LoginForm onSubmit={handleSubmit}>
                <Title>Login</Title>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <FormGroup>
                    <Label htmlFor="email">Email:</Label>
                    <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="password">Password:</Label>
                    <Input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </FormGroup>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </LoginForm>
        </LoginContainer>
    );
};

export default Login;
