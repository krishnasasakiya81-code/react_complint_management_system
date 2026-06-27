import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import ForgotPasswordCard from '../../components/auth/ForgotPasswordCard';

const ForgotPassword = () => {
  return (
    <AuthLayout
      title="Forgot Password"
      description="If you forgot your password, enter your email here and we’ll send you the steps to reset it."
    >
      <ForgotPasswordCard />
    </AuthLayout>
  );
};

export default ForgotPassword;
