import { createBrowserRouter } from 'react-router-dom';
import { Login, NotFound } from './pages';
import Home from './pages/home/page';
import TeacherPage from './pages/teacher-v2/page';
import ParentPage from './pages/parent-v2/page';
import ParentDashboardPage from './pages/parent-dashboard/page';
import AdminPage from './pages/admin-v2/page';
import AuthCallback from './pages/auth/AuthCallback';
import AuthSetup from './pages/auth/AuthSetup';
import AuthPending from './pages/auth/AuthPending';

export const router = createBrowserRouter([
  // 공개
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },

  // 인증 플로우
  { path: '/auth/callback', element: <AuthCallback /> },
  { path: '/auth/setup', element: <AuthSetup /> },
  { path: '/auth/pending', element: <AuthPending /> },

  // 교사 영역 (self-contained with sidebar)
  { path: '/teacher', element: <TeacherPage /> },

  // 보호자 영역
  { path: '/parent', element: <ParentPage /> },
  { path: '/parent-dashboard', element: <ParentDashboardPage /> },

  // 관리자
  { path: '/admin', element: <AdminPage /> },

  // 404
  { path: '*', element: <NotFound /> },
]);
