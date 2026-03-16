import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types';

interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function RoleRoute({ children, allowedRoles }: RoleRouteProps) {
  const { role, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 프로필 미설정 → 역할 선택 화면
  if (!profile?.organization_id) {
    return <Navigate to="/auth/setup" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    if (role === 'parent') return <Navigate to="/parent" replace />;
    return <Navigate to="/teacher" replace />;
  }

  return <>{children}</>;
}
