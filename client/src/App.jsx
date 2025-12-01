import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
// import Layout from './components/Layout';
import Register from './pages/Register';
import Scan from './pages/Scan';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Attendees from './pages/Attendees';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* <Layout> */}
          <Routes>
            <Route path="/" element={<Navigate to="/register" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/attendees" element={<Attendees />} />
            <Route path="*" element={<Navigate to="/register" replace />} />
          </Routes>
        {/* </Layout> */}
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;

