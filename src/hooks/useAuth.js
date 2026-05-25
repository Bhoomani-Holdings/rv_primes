// Hook for auth state and actions
export function useAuth() {
  return {
    user: null,
    isAuthenticated: false,
  };
}
