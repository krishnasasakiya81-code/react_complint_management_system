import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import DepartmentLoginCard from '../../components/auth/DepartmentLoginCard';

const DepartmentLogin = () => {
  return (
    <AuthLayout
      title="Department Login"
      description="Sign in to your department account to manage complaints, track issues, and update their status."
    >
      <DepartmentLoginCard />
    </AuthLayout>
  );
};

export default DepartmentLogin;
