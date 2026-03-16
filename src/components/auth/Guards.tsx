import type { ReactNode } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import type { UserRole } from '../../types';

export function TeacherGuard({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <RoleRoute allowedRoles={['teacher', 'admin'] as UserRole[]}>
        {children}
      </RoleRoute>
    </ProtectedRoute>
  );
}

export function ParentGuard({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <RoleRoute allowedRoles={['parent'] as UserRole[]}>
        {children}
      </RoleRoute>
    </ProtectedRoute>
  );
}

export function AdminGuard({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <RoleRoute allowedRoles={['teacher', 'admin'] as UserRole[]}>
        {children}
      </RoleRoute>
    </ProtectedRoute>
  );
}
