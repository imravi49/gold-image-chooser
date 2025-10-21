import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/services/database';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [requireAdmin]);

  const checkAuth = async () => {
    try {
      const user = await db.auth.getCurrentUser();
      
      if (!user) {
        navigate(requireAdmin ? '/admin-login' : '/');
        return;
      }

      if (requireAdmin) {
        // Check if user has admin role
        const { getFirestore, doc, getDoc } = await import('firebase/firestore');
        const firestore = getFirestore();
        const roleDoc = await getDoc(doc(firestore, 'user_roles', user.uid));

        if (!roleDoc.exists() || roleDoc.data().role !== 'admin') {
          navigate('/');
          return;
        }
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      navigate(requireAdmin ? '/admin-login' : '/');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen cinematic-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
};
