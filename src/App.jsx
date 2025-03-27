import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RSVPProvider } from './context/RSVP/RSVPProvider';
import { AuthProvider } from './context/Auth/AuthProvider';
import { UserProvider } from './context/User/UserProvider';
import Auth from './Components/Auth/Auth';
import Dashboard from './Components/Dashboard/Dashboard';
import SingleWedding from './Components/Dashboard/SingleWedding/SingleWedding';
import GuestList from './Components/GuestList/GuestList';
import GuestResponses from './Components/GuestResponses/GuestResponses';
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
            <UserProvider>
              <Routes>
                <Route path="auth" element={<Auth />} />
                <Route path="dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="wedding/:id" element={
                  <ProtectedRoute>
                    <SingleWedding />
                  </ProtectedRoute>
                } />
                <Route path="wedding/:id/guests" element={
                  <ProtectedRoute>
                    <GuestList />
                  </ProtectedRoute>
                } />
                <Route path="wedding/:id/responses" element={
                  <ProtectedRoute>
                    <GuestResponses />
                  </ProtectedRoute>
                } />
              </Routes>
            </UserProvider>
          </AuthProvider>
        } />
      </Routes>
    </Router>
  )
}

export default App;