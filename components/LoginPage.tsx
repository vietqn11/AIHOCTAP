
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (name: string, className: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '' || className.trim() === '') {
      setError('Vui lòng nhập đầy đủ họ tên và lớp.');
      return;
    }
    onLogin(name, className);
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Chào mừng đến với lớp học!</h2>
          <p className="text-gray-500 mt-2">Vui lòng nhập thông tin để bắt đầu</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn An"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">Lớp</label>
            <input
              id="className"
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Ví dụ: 2A"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
            >
              Bắt đầu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
