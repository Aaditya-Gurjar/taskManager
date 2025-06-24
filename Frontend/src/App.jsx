
import { Navigate, Route, Routes } from "react-router-dom"
import { LoginCard } from "./components/loginCard"
import { ToastContainer, toast } from 'react-toastify'
import Dashboard from "./components/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"


function App() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginCard />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/home" element={<Home />} /> */}

        </Route>
      </Routes>

      <ToastContainer />
    </div>
  )
}

export default App