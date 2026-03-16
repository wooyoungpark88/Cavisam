import { MainLayout } from '../../components/layout';

export function SystemLog() {
  return (
    <MainLayout activeMenuItem="system-log">
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">시스템 로그</h2>
        <p className="text-gray-400">해당 기능은 준비 중입니다.</p>
      </div>
    </MainLayout>
  );
}
