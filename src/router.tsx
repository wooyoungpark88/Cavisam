import { createBrowserRouter } from 'react-router-dom';
import { Landing, Login, NotFound } from './pages';
import TeacherPage from './pages/teacher-v2/page';
import ParentPage from './pages/parent-v2/page';
import ParentDashboardPage from './pages/parent-dashboard/page';
import AdminPage from './pages/admin-v2/page';

export const router = createBrowserRouter([
  // 공개
  { path: '/', element: <Landing /> },
  { path: '/login', element: <Login /> },

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
