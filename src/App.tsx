import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Analytics } from './pages/Analytics';
import { Services } from './pages/Services';
import { Security } from './pages/Security';
import { Users } from './pages/Users';
import { Performance } from './pages/Performance';
import { LiveTerminal } from './pages/LiveTerminal';
import './index.css';
import { LogProvider } from './contexts/LogContext';
import { AppLayout } from './components/Layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Logs } from './pages/Logs';
import { Toaster } from './components/ui/sonner';
import { BiddingMonitor } from './pages/BiddingMonitor';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <LogProvider>
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/logs" element={<Logs />} />
                    <Route path="/terminal" element={<LiveTerminal />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/security" element={<Security />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/performance" element={<Performance />} />
                    <Route path="/bidding-monitor" element={<BiddingMonitor />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            </LogProvider>
          </AuthProvider>
          <Toaster />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;