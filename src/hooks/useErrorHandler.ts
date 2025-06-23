
import { useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorDetails {
  message: string;
  code?: string;
  statusCode?: number;
}

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown, customMessage?: string) => {
    console.error('Error occurred:', error);

    let errorDetails: ErrorDetails = {
      message: 'An unexpected error occurred'
    };

    if (error instanceof Error) {
      errorDetails.message = error.message;
    } else if (typeof error === 'string') {
      errorDetails.message = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorDetails = error as ErrorDetails;
    }

    // Map common error codes to user-friendly messages
    const userFriendlyMessage = getUserFriendlyMessage(errorDetails);
    
    toast.error(customMessage || userFriendlyMessage, {
      duration: 5000,
      action: {
        label: 'Dismiss',
        onClick: () => {}
      }
    });

    // Log to monitoring service in production
    if (import.meta.env.PROD) {
      logErrorToService(errorDetails);
    }

    return errorDetails;
  }, []);

  const handleApiError = useCallback((error: any) => {
    if (error?.response?.status === 401) {
      toast.error('Please log in to continue');
      // Redirect to login or trigger auth refresh
      return;
    }

    if (error?.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
      return;
    }

    if (error?.response?.status === 429) {
      toast.error('Too many requests. Please try again later');
      return;
    }

    if (error?.response?.status >= 500) {
      toast.error('Server error. Please try again later');
      return;
    }

    handleError(error?.response?.data?.message || error?.message || 'API request failed');
  }, [handleError]);

  return { handleError, handleApiError };
};

function getUserFriendlyMessage(errorDetails: ErrorDetails): string {
  const { message, statusCode } = errorDetails;

  if (statusCode === 404) return 'The requested resource was not found';
  if (statusCode === 500) return 'Server error. Please try again later';
  if (message.includes('network')) return 'Network error. Please check your connection';
  if (message.includes('timeout')) return 'Request timed out. Please try again';
  
  return message;
}

function logErrorToService(errorDetails: ErrorDetails) {
  // TODO: Integrate with error monitoring service
  console.error('Production error logged:', errorDetails);
}
