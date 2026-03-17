import { createBrowserRouter } from 'react-router-dom';
import {
  Landing, Login, NotFound,
  TeacherDashboard, EventGroupManagement, BehaviorStats,
  RealtimeVideo, BehaviorAnalysis, InterventionReport, ParentNotification,
  ParentCommunication,
  StudentManagement, UserManagement, DeviceManagement,
  VideoHistory, SystemLog, SystemError, AiReport,
} from './pages';
import { MainLayout } from './components/layout';
import { TeacherGuard, ParentGuard, AdminGuard } from './components/auth/Guards';

export const router = createBrowserRouter([
  // 공개
  { path: '/', element: <Landing /> },
  { path: '/login', element: <Login /> },

  // 교사 영역
  {
    path: '/teacher',
    element: (
      <TeacherGuard>
        <MainLayout>
          <TeacherDashboard />
        </MainLayout>
      </TeacherGuard>
    ),
  },
  {
    path: '/teacher/parent-notification',
    element: (
      <TeacherGuard>
        <MainLayout>
          <ParentNotification />
        </MainLayout>
      </TeacherGuard>
    ),
  },
  {
    path: '/teacher/event-group',
    element: (
      <TeacherGuard>
        <EventGroupManagement />
      </TeacherGuard>
    ),
  },
  {
    path: '/teacher/behavior-stats',
    element: (
      <TeacherGuard>
        <BehaviorStats />
      </TeacherGuard>
    ),
  },
  {
    path: '/teacher/realtime-video',
    element: (
      <TeacherGuard>
        <RealtimeVideo />
      </TeacherGuard>
    ),
  },
  {
    path: '/teacher/behavior-analysis',
    element: (
      <TeacherGuard>
        <BehaviorAnalysis />
      </TeacherGuard>
    ),
  },
  {
    path: '/teacher/intervention-report',
    element: (
      <TeacherGuard>
        <InterventionReport />
      </TeacherGuard>
    ),
  },

  // 보호자 영역
  {
    path: '/parent',
    element: (
      <ParentGuard>
        <MainLayout>
          <ParentCommunication />
        </MainLayout>
      </ParentGuard>
    ),
  },

  // 관리자 서비스
  {
    path: '/admin/students',
    element: (
      <AdminGuard>
        <StudentManagement />
      </AdminGuard>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <AdminGuard>
        <UserManagement />
      </AdminGuard>
    ),
  },
  {
    path: '/admin/devices',
    element: (
      <AdminGuard>
        <DeviceManagement />
      </AdminGuard>
    ),
  },
  {
    path: '/admin/video-history',
    element: (
      <AdminGuard>
        <VideoHistory />
      </AdminGuard>
    ),
  },
  {
    path: '/admin/system-log',
    element: (
      <AdminGuard>
        <SystemLog />
      </AdminGuard>
    ),
  },
  {
    path: '/admin/system-error',
    element: (
      <AdminGuard>
        <SystemError />
      </AdminGuard>
    ),
  },
  {
    path: '/admin/ai-report',
    element: (
      <AdminGuard>
        <AiReport />
      </AdminGuard>
    ),
  },

  // 404
  { path: '*', element: <NotFound /> },
]);
