import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { Analytics } from './pages/Analytics';
import { Services } from './pages/Services';
import { Security } from './pages/Security';
import { Users } from './pages/Users';
import { Performance } from './pages/Performance';
import './index.css';
import { LogProvider } from './contexts/LogContext';
import { AppLayout } from './components/Layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Logs } from './pages/Logs';

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
        <LogProvider>
          <Router>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/services" element={<Services />} />
                <Route path="/security" element={<Security />} />
                <Route path="/users" element={<Users />} />
                <Route path="/performance" element={<Performance />} />
              </Routes>
            </AppLayout>
          </Router>
        </LogProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;