import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import VerifyOTPCard from '../../components/auth/VerifyOTPCard';

const VerifyOTP = () => {
  return (
    <AuthLayout
      title="Verify OTP"
      description="Enter the code sent to your email to complete login. If you did not receive the code, request a new one."
    >
      <VerifyOTPCard />
    </AuthLayout>
  );
};

export default VerifyOTP;
