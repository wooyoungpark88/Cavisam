import { createBrowserRouter } from 'react-router-dom';
import {
  Landing, Login, NotFound,
  TeacherDashboard, EventGroupManagement, BehaviorStats,
  RealtimeVideo, BehaviorAnalysis, InterventionReport, ParentNotification,
  ParentReports, CareTeam,
  ParentCommunication, ParentTimeline, MorningReport,
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
    path: '/teacher/parent-reports',
    element: (
      <TeacherGuard>
        <MainLayout>
          <ParentReports />
        </MainLayout>
      </TeacherGuard>
    ),
  },
  {
    path: '/teacher/event-group',
    element: (
      <TeacherGuard>
        <MainLayout>
          <EventGroupManagement />
        </MainLayout>
      </TeacherGuard>
    ),
  },
  {
    path: '/teacher/behavior-stats',
    element: (
      <TeacherGuard>
        <MainLayout>
          <BehaviorStats />
        </MainLayout>
      </TeacherGuard>
    ),
  },
  {
    path: '/teacher/care-team',
    element: (
      <TeacherGuard>
        <MainLayout>
          <CareTeam />
        </MainLayout>
      </TeacherGuard>
    ),
  },
  {
    path: '/teacher/realtime-video',
    element: (
      <TeacherGuard>
        <MainLayout>
          <RealtimeVideo />
        </MainLayout>
      </TeacherGuard>
    ),
  },
  {
    path: '/teacher/behavior-analysis',
    element: (
      <TeacherGuard>
        <MainLayout>
          <BehaviorAnalysis />
        </MainLayout>
      </TeacherGuard>
    ),
  },
  {
    path: '/teacher/intervention-report',
    element: (
      <TeacherGuard>
        <MainLayout>
          <InterventionReport />
        </MainLayout>
      </TeacherGuard>
    ),
  },

  // 보호자 영역
  {
    path: '/parent',
    element: (
      <ParentGuard>
        <MainLayout>
          <ParentTimeline />
        </MainLayout>
      </ParentGuard>
    ),
  },
  {
    path: '/parent/communication',
    element: (
      <ParentGuard>
        <MainLayout>
          <ParentCommunication />
        </MainLayout>
      </ParentGuard>
    ),
  },
  {
    path: '/parent/morning-report',
    element: (
      <ParentGuard>
        <MainLayout>
          <MorningReport />
        </MainLayout>
      </ParentGuard>
    ),
  },
  {
    path: '/parent/behavior-stats',
    element: (
      <ParentGuard>
        <MainLayout>
          <BehaviorStats />
        </MainLayout>
      </ParentGuard>
    ),
  },
  {
    path: '/parent/care-team',
    element: (
      <ParentGuard>
        <MainLayout>
          <CareTeam />
        </MainLayout>
      </ParentGuard>
    ),
  },

  // 관리자 서비스
  {
    path: '/admin/students',
    element: (
      <AdminGuard>
        <MainLayout>
          <StudentManagement />
        </MainLayout>
      </AdminGuard>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <AdminGuard>
        <MainLayout>
          <UserManagement />
        </MainLayout>
      </AdminGuard>
    ),
  },
  {
    path: '/admin/devices',
    element: (
      <AdminGuard>
        <MainLayout>
          <DeviceManagement />
        </MainLayout>
      </AdminGuard>
    ),
  },
  {
    path: '/admin/video-history',
    element: (
      <AdminGuard>
        <MainLayout>
          <VideoHistory />
        </MainLayout>
      </AdminGuard>
    ),
  },
  {
    path: '/admin/system-log',
    element: (
      <AdminGuard>
        <MainLayout>
          <SystemLog />
        </MainLayout>
      </AdminGuard>
    ),
  },
  {
    path: '/admin/system-error',
    element: (
      <AdminGuard>
        <MainLayout>
          <SystemError />
        </MainLayout>
      </AdminGuard>
    ),
  },
  {
    path: '/admin/ai-report',
    element: (
      <AdminGuard>
        <MainLayout>
          <AiReport />
        </MainLayout>
      </AdminGuard>
    ),
  },

  // 404
  { path: '*', element: <NotFound /> },
]);
