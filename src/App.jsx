import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated, user, loadUser } = useAuthStore();

  useEffect(() => {
    // Only load user if we have a token but no user data
    if (isAuthenticated && !user) {
      loadUser();
    }
  }, [isAuthenticated, user, loadUser]);

  return <RouterProvider router={router} />;
}

export default App;