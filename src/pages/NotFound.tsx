import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-gray-200 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">페이지를 찾을 수 없습니다</h1>
        <p className="text-gray-500 mb-8">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
