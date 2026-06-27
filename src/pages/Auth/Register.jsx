import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import RegisterCard from '../../components/auth/RegisterCard';

const Register = () => {
  return (
    <AuthLayout
      title="Join GOVTRACK"
      description="Create your account and become part of a community dedicated to transparent governance. Help us improve public services by reporting issues and tracking their resolution in real-time."
    >
      <RegisterCard />
    </AuthLayout>
  );
};

export default Register;
