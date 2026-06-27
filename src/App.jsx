import { useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");
  const isDepartment = location.pathname.startsWith("/department");

  return (
    <>
      {/* 🔥 Admin & Department pages pe Navbar hide */}
      {!isAdmin && !isDepartment && <Navbar />}

      <AppRoutes />

      {/* 🔥 Admin & Department pages pe Footer bhi hide */}
      {!isAdmin && !isDepartment && <Footer />}
    </>
  );
}

export default App;