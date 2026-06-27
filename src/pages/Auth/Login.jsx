import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import LoginCard from '../../components/auth/LoginCard';

const Login = () => {
  return (
    <AuthLayout
      title="Welcome Back"
      description="Sign in to your GOVTRACK account to file, track, and manage your complaints. Access your dashboard to view the status of your reported issues and communicate with authorities."
    >
      <LoginCard />
    </AuthLayout>
  );
};

export default Login;
