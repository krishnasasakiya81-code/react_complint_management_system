import { createContext, useState, useEffect } from "react";

export const DepartmentAuthContext = createContext();

export const DepartmentAuthProvider = ({ children }) => {
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedDepartment = localStorage.getItem("loggedDepartment");
    if (storedDepartment) {
      setDepartment(JSON.parse(storedDepartment));
    }
    setLoading(false);
  }, []);

  const login = (departmentData) => {
    localStorage.setItem("loggedDepartment", JSON.stringify(departmentData));
    setDepartment(departmentData);
  };

  const logout = () => {
    localStorage.removeItem("loggedDepartment");
    setDepartment(null);
  };

  return (
    <DepartmentAuthContext.Provider value={{ department, login, logout, loading }}>
      {children}
    </DepartmentAuthContext.Provider>
  );
};
