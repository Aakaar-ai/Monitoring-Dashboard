import { LogEntry } from '../types';

export const getLogLevelColor = (level: string): string => {
  const colors = {
    debug: 'text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-800',
    info: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900',
    warn: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900',
    error: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900',
    fatal: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900',
  };
  return colors[level as keyof typeof colors] || colors.info;
};

export const getLogLevelIcon = (level: string): string => {
  const icons = {
    debug: '🐛',
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
    fatal: '💀',
  };
  return icons[level as keyof typeof icons] || '📝';
};

export const truncateMessage = (message: string, maxLength = 100): string => {
  if (message.length <= maxLength) return message;
  return `${message.substring(0, maxLength)}...`;
};

export const highlightSearchTerm = (text: string, searchTerm: string, isRegex = false): string => {
  if (!searchTerm) return text;

  try {
    if (isRegex) {
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
    } else {
      const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
    }
  } catch {
    return text;
  }
};

export const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateMockLogs = (count = 100): LogEntry[] => {
  const levels = ['debug', 'info', 'warn', 'error', 'fatal'];
  const services = ['auth-service', 'user-service', 'api-gateway', 'payment-service', 'notification-service'];
  const categories = ['authentication', 'database', 'network', 'security', 'performance'];
  const sections = ['controller', 'middleware', 'service', 'repository', 'utils'];
  
  const messages = [
    'User login successful',
    'Database connection established',
    'API request processed',
    'Payment transaction completed',
    'Email notification sent',
    'Authentication failed',
    'Database query timeout',
    'Rate limit exceeded',
    'Internal server error',
    'Cache miss occurred',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `log-${Date.now()}-${i}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    level: levels[Math.floor(Math.random() * levels.length)] as any,
    service: services[Math.floor(Math.random() * services.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    section: sections[Math.floor(Math.random() * sections.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    metadata: Math.random() > 0.5 ? {
      userId: `user-${Math.floor(Math.random() * 1000)}`,
      requestId: `req-${Math.random().toString(36).substr(2, 9)}`,
      duration: Math.floor(Math.random() * 1000),
      statusCode: [200, 201, 400, 401, 404, 500][Math.floor(Math.random() * 6)],
    } : undefined,
    requestId: `req-${Math.random().toString(36).substr(2, 9)}`,
    userId: Math.random() > 0.3 ? `user-${Math.floor(Math.random() * 100)}` : undefined,
  }));
};