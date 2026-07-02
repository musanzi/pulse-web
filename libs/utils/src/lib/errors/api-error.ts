export function getApiErrorMessage(error: Error, fallback = 'Une erreur est survenue'): string {
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const responseError = (error as { error?: unknown }).error;

    if (typeof responseError === 'object' && responseError !== null && 'message' in responseError) {
      const message = (responseError as { message?: unknown }).message;
      return Array.isArray(message) ? message.join(', ') : String(message);
    }

    if (typeof responseError === 'string') {
      return responseError;
    }
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message?: unknown }).message);
  }

  return fallback;
}
