import { Alert } from 'react-native';

// Error types
export const ErrorTypes = {
  VALIDATION: 'VALIDATION',
  NETWORK: 'NETWORK',
  AUTH: 'AUTH',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN',
};

// Custom error class
export class AppError extends Error {
  constructor(type, message, originalError = null) {
    super(message);
    this.type = type;
    this.originalError = originalError;
    this.name = 'AppError';
  }
}

// Error messages mapping
const ErrorMessages = {
  [ErrorTypes.NETWORK]: 'Network connection error. Please check your internet connection.',
  [ErrorTypes.AUTH]: 'Authentication error. Please try logging in again.',
  [ErrorTypes.SERVER]: 'Server error. Please try again later.',
  [ErrorTypes.UNKNOWN]: 'An unexpected error occurred. Please try again.',
};

// Main error handler
export const handleError = (error, customTitle = 'Error') => {
  console.error('Error details:', error);

  let errorMessage = error.message;
  let errorType = error.type || ErrorTypes.UNKNOWN;

  // Handle network errors
  if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
    errorType = ErrorTypes.NETWORK;
    errorMessage = ErrorMessages[ErrorTypes.NETWORK];
  }

  // Handle server errors (status codes 500+)
  if (error.status >= 500) {
    errorType = ErrorTypes.SERVER;
    errorMessage = ErrorMessages[ErrorTypes.SERVER];
  }

  // Handle authentication errors (status codes 401, 403)
  if (error.status === 401 || error.status === 403) {
    errorType = ErrorTypes.AUTH;
    errorMessage = ErrorMessages[ErrorTypes.AUTH];
  }

  // Show error alert
  Alert.alert(
    customTitle,
    errorMessage,
    [{ text: 'OK' }],
    { cancelable: false }
  );

  return { type: errorType, message: errorMessage };
};

// API error handler
export const handleApiError = async (response) => {
  if (!response.ok) {
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || 'An error occurred';
    } catch (e) {
      errorMessage = 'An error occurred while processing the request';
    }

    throw new AppError(
      response.status === 401 || response.status === 403 ? ErrorTypes.AUTH : ErrorTypes.SERVER,
      errorMessage,
      { status: response.status }
    );
  }
  return response;
};
