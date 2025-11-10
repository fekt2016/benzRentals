// Auth Sync Page - Syncs authentication token from mobile app
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import styled from 'styled-components';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const AuthSyncPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('syncing'); // 'syncing', 'success', 'error'
  const [message, setMessage] = useState('Syncing authentication...');

  useEffect(() => {
    const syncToken = async () => {
      try {
        // Get token from URL parameter
        const token = searchParams.get('token');
        
        if (!token) {
          setStatus('error');
          setMessage('No token provided. Please log in again.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          return;
        }

        // Validate token format (basic check)
        if (typeof token !== 'string' || token.length < 10) {
          setStatus('error');
          setMessage('Invalid token format.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          return;
        }

        // Decode token to verify it's valid
        try {
          const decoded = jwtDecode(token);
          console.log('[AuthSync] Token decoded successfully:', {
            userId: decoded.id,
            email: decoded.email,
            role: decoded.role,
          });

          // Store token in cookie (same way web app does)
          const isProduction = process.env.NODE_ENV === 'production';
          Cookies.set('token', token, {
            expires: 7,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
            path: '/',
          });

          setStatus('success');
          setMessage('Authentication synced successfully! Redirecting...');

          // Redirect to appropriate page based on role
          setTimeout(() => {
            if (decoded.role === 'admin') {
              navigate('/admin');
            } else if (decoded.role === 'driver') {
              navigate('/driver/dashboard');
            } else {
              navigate('/');
            }
          }, 1500);
        } catch (decodeError) {
          console.error('[AuthSync] Token decode error:', decodeError);
          setStatus('error');
          setMessage('Invalid token. Please log in again.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (error) {
        console.error('[AuthSync] Sync error:', error);
        setStatus('error');
        setMessage('Failed to sync authentication. Please log in again.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    syncToken();
  }, [searchParams, navigate]);

  return (
    <Container>
      <Content>
        {status === 'syncing' && (
          <>
            <LoadingSpinner size="xl" />
            <Title>Syncing Authentication</Title>
            <Message>{message}</Message>
          </>
        )}
        {status === 'success' && (
          <>
            <SuccessIcon>✅</SuccessIcon>
            <Title>Success!</Title>
            <Message>{message}</Message>
          </>
        )}
        {status === 'error' && (
          <>
            <ErrorIcon>❌</ErrorIcon>
            <Title>Sync Failed</Title>
            <Message>{message}</Message>
          </>
        )}
      </Content>
    </Container>
  );
};

export default AuthSyncPage;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--surface);
  padding: var(--space-xl);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  text-align: center;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
`;

const Message = styled.p`
  font-size: var(--text-md);
  color: var(--text-secondary);
  margin: 0;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
`;

