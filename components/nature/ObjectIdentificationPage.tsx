import React, { useState, useRef, useCallback } from 'react';
import { PageProps, ObjectIdentificationResult } from '../../types';
import { analyzeImageForNature } from '../../services/geminiService';
import Spinner from '../Spinner';

const ObjectIdentificationPage = (props: PageProps) => {
    const [result, setResult] = useState<ObjectIdentificationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraOn(true);
                setError(null);
                setResult(null);
            }
        } catch (err) {
            setError("Không thể bật camera. Vui lòng cấp quyền và thử lại.");
            console.error(err);
        }
    }, []);
    
    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsCameraOn(false);
        }
    }, []);

    const captureAndAnalyze = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const context = canvas.getContext('2d');
        if(!context) return;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageBase64 = canvas.toDataURL('image/jpeg').split(',')[1];
        
        stopCamera();
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const analysisResult = await analyzeImageForNature(imageBase64);
            setResult(analysisResult);
        } catch (err) {
            setError("AI không thể nhận diện được. Vui lòng thử lại với hình ảnh rõ hơn.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [stopCamera]);
    
    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">AI nhận diện vật thể</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center">
                
                {error && <p className="text-red-500 mb-4">{error}</p>}
                
                {!isCameraOn && !isLoading && !result && (
                    <button onClick={startCamera} className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700">
                        Bật Camera để quét
                    </button>
                )}

                {isCameraOn && (
                    <div className="flex flex-col items-center">
                        <video ref={videoRef} autoPlay playsInline className="w-full rounded-md border mb-4 max-h-80" />
                        <button onClick={captureAndAnalyze} className="px-8 py-3 bg-rose-600 text-white font-semibold rounded-full shadow-lg text-lg">
                            Chụp & Phân tích
                        </button>
                    </div>
                )}
                
                <canvas ref={canvasRef} className="hidden" />

                {isLoading && (
                    <div className="h-40 flex flex-col justify-center items-center">
                        <Spinner />
                        <p className="mt-4 text-lg text-gray-600">AI đang phân tích hình ảnh...</p>
                    </div>
                )}

                {result && (
                    <div>
                         <h3 className="text-2xl font-bold text-teal-700 mb-4">AI tìm thấy: {result.name}</h3>
                         <div className="text-left space-y-3">
                            <p><strong className="font-semibold">Mô tả:</strong> {result.description}</p>
                            <p><strong className="font-semibold">Sự thật thú vị:</strong> {result.funFact}</p>
                         </div>
                         <button onClick={startCamera} className="mt-6 px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700">
                            Quét vật thể khác
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ObjectIdentificationPage;
