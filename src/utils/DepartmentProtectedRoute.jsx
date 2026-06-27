import { Navigate } from "react-router-dom";

const DepartmentProtectedRoute = ({ children }) => {
  const department = JSON.parse(localStorage.getItem("loggedDepartment"));

  if (!department) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default DepartmentProtectedRoute;
