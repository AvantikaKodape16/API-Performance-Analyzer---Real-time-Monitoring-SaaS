/**
 * Format response time in milliseconds
 * @param {number} ms - Response time in milliseconds
 * @returns {string} Formatted string
 */
export const formatResponseTime = (ms) => {
  if (ms < 1000) {
    return `${ms.toFixed(0)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
};

/**
 * Format percentage with decimal places
 * @param {number} percent - Percentage value
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (percent) => {
  return `${percent.toFixed(2)}%`;
};

/**
 * Get status badge color based on status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} Color class name
 */
export const getStatusColor = (statusCode) => {
  if (statusCode >= 200 && statusCode < 300) {
    return 'status-success';
  } else if (statusCode >= 300 && statusCode < 400) {
    return 'status-redirect';
  } else if (statusCode >= 400 && statusCode < 500) {
    return 'status-client-error';
  } else if (statusCode >= 500) {
    return 'status-server-error';
  }
  return 'status-unknown';
};

/**
 * Get status badge text based on status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} Status text
 */
export const getStatusText = (statusCode) => {
  const statusMap = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    301: 'Moved Permanently',
    302: 'Found',
    304: 'Not Modified',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    408: 'Request Timeout',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
  };
  return statusMap[statusCode] || `Status ${statusCode}`;
};

/**
 * Format date/time for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Format date for time-only display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted time
 */
export const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Calculate uptime percentage
 * @param {number} totalRequests - Total number of requests
 * @param {number} errorCount - Number of errors
 * @returns {number} Uptime percentage
 */
export const calculateUptime = (totalRequests, errorCount) => {
  if (totalRequests === 0) return 100;
  return ((totalRequests - errorCount) / totalRequests) * 100;
};

/**
 * Get alert severity level
 * @param {string} alertType - Type of alert
 * @returns {string} Severity level
 */
export const getAlertSeverity = (alertType) => {
  const severityMap = {
    'slow_response': 'warning',
    'error': 'critical',
    'timeout': 'critical',
  };
  return severityMap[alertType] || 'info';
};

/**
 * Get alert icon based on type
 * @param {string} alertType - Type of alert
 * @returns {string} Icon character or emoji
 */
export const getAlertIcon = (alertType) => {
  const iconMap = {
    'slow_response': '⏱️',
    'error': '❌',
    'timeout': '⏳',
  };
  return iconMap[alertType] || '⚠️';
};

/**
 * Calculate average from array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Average value
 */
export const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
};

/**
 * Find minimum value in array
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Minimum value
 */
export const findMin = (numbers) => {
  if (numbers.length === 0) return 0;
  return Math.min(...numbers);
};

/**
 * Find maximum value in array
 * @param {number[]} numbers - Array of numbers
 * @returns {number} Maximum value
 */
export const findMax = (numbers) => {
  if (numbers.length === 0) return 0;
  return Math.max(...numbers);
};

/**
 * Parse JSON safely
 * @param {string} jsonString - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} Parsed object or default value
 */
export const safeJSONParse = (jsonString, defaultValue = {}) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON Parse Error:', error);
    return defaultValue;
  }
};

/**
 * Check if endpoint is healthy (based on error rate)
 * @param {number} errorRate - Error rate percentage
 * @param {number} threshold - Threshold percentage (default 5%)
 * @returns {boolean} True if healthy
 */
export const isEndpointHealthy = (errorRate, threshold = 5) => {
  return errorRate <= threshold;
};

/**
 * Get endpoint health status text
 * @param {number} errorRate - Error rate percentage
 * @returns {string} Health status
 */
export const getHealthStatus = (errorRate) => {
  if (errorRate === 0) return '✅ Perfect';
  if (errorRate < 1) return '✅ Excellent';
  if (errorRate < 5) return '✅ Good';
  if (errorRate < 10) return '⚠️ Fair';
  return '❌ Poor';
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Retry failed requests
 * @param {Function} fn - Async function to retry
 * @param {number} retries - Number of retries
 * @param {number} delay - Delay between retries in milliseconds
 * @returns {Promise} Result of function
 */
export const retryAsync = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Truncate string to max length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength = 50) => {
  return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
};

/**
 * Format URL for display
 * @param {string} url - URL to format
 * @returns {string} Formatted URL
 */
export const formatUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
  } catch (error) {
    return url;
  }
};

/**
 * Check if response time is within acceptable range
 * @param {number} responseTime - Response time in ms
 * @param {number} threshold - Threshold in ms
 * @returns {boolean} True if acceptable
 */
export const isResponseTimeAcceptable = (responseTime, threshold = 1000) => {
  return responseTime <= threshold;
};

/**
 * Get color for response time visualization
 * @param {number} responseTime - Response time in ms
 * @param {number} threshold - Threshold in ms
 * @returns {string} Color code
 */
export const getResponseTimeColor = (responseTime, threshold = 1000) => {
  const ratio = responseTime / threshold;
  if (ratio < 0.5) return '#51cf66'; // Green - Fast
  if (ratio < 0.8) return '#ffd43b'; // Yellow - Acceptable
  if (ratio < 1.2) return '#ff922b'; // Orange - Slow
  return '#ff6b6b'; // Red - Very Slow
};

/**
 * Get HTTP method badge class
 * @param {string} method - HTTP method
 * @returns {string} CSS class
 */
export const getMethodBadgeClass = (method) => {
  const methodMap = {
    'GET': 'method-get',
    'POST': 'method-post',
    'PUT': 'method-put',
    'DELETE': 'method-delete',
    'PATCH': 'method-patch',
  };
  return methodMap[method] || 'method-unknown';
};

export default {
  formatResponseTime,
  formatPercentage,
  getStatusColor,
  getStatusText,
  formatDate,
  formatTime,
  calculateUptime,
  getAlertSeverity,
  getAlertIcon,
  calculateAverage,
  findMin,
  findMax,
  safeJSONParse,
  isEndpointHealthy,
  getHealthStatus,
  debounce,
  throttle,
  retryAsync,
  generateId,
  truncate,
  formatUrl,
  isResponseTimeAcceptable,
  getResponseTimeColor,
  getMethodBadgeClass,
};