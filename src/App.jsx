import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RSVPProvider } from './context/RSVP/RSVPProvider';
import { AuthProvider } from './context/Auth/AuthProvider';
import Auth from './Components/Auth/Auth';
import GuestList from './Components/GuestList/GuestList';
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes with RSVP functionality */}
        <Route path="/" element={
          <RSVPProvider>
            <PublicRoute />
          </RSVPProvider>
        } />
        
        {/* Admin routes with Auth functionality */}
        <Route path="/admin/*" element={
          <AuthProvider>
            <Routes>
              <Route path="auth" element={<Auth />} />
              <Route path="guests" element={
                <ProtectedRoute>
                  <GuestList />
                </ProtectedRoute>
              } />
            </Routes>
          </AuthProvider>
        } />
      </Routes>
    </Router>
  )
}

export default App;