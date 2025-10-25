
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User, HandwritingFeedback } from '../../types';
import { evaluateHandwrittenText } from '../../services/geminiService';
import Spinner from '../Spinner';

interface HandwritingEvaluationPageProps {
  user: User;
  onBack: () => void;
  onFinish: (feedback: HandwritingFeedback) => void;
}

const HandwritingEvaluationPage: React.FC<HandwritingEvaluationPageProps> = ({ user, onBack, onFinish }) => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setError("Không thể truy cập camera. Vui lòng cấp quyền và thử lại.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setImageData(dataUrl);
      }
    }
  };

  const handleSubmit = async () => {
    if (!imageData) return;
    setIsLoading(true);
    setError('');
    try {
      // The base64 string includes the prefix "data:image/jpeg;base64,", we need to remove it.
      const base64String = imageData.split(',')[1];
      const feedback = await evaluateHandwrittenText(base64String);
      onFinish(feedback);
    } catch (e) {
      setError("AI không thể chấm bài lúc này. Vui lòng thử lại sau.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="text-blue-600 hover:underline mb-4">&larr; Quay lại</button>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Chấm Bài Viết Tay</h2>
        <p className="text-gray-500 mt-2">Đặt bài viết của con vào khung hình và nhấn nút chụp nhé!</p>

        {error && <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}

        <div className="my-6 relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden border">
          {imageData ? (
            <img src={imageData} alt="Captured essay" className="w-full h-full object-contain" />
          ) : (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
          )}
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
        
        {isLoading ? <div className="flex justify-center"><Spinner /> <p className="ml-4">AI đang đọc bài của con...</p></div> : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {imageData ? (
              <>
                <button onClick={() => setImageData(null)} className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-full hover:bg-gray-600 transition">Chụp lại</button>
                <button onClick={handleSubmit} className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-full hover:bg-blue-700 transition">Gửi bài chấm</button>
              </>
            ) : (
              <button onClick={handleCapture} className="px-8 py-4 bg-red-500 text-white text-xl font-bold rounded-full hover:bg-red-600 transition">📸 Chụp ảnh</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HandwritingEvaluationPage;
