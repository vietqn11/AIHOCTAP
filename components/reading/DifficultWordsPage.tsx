import React, { useState, useEffect } from 'react';
import { PageProps } from '../../types';
import { identifyAndExplainDifficultWords, generateTextToSpeech } from '../../services/geminiService';
import { playBase64Audio } from '../../utils/audioUtils';
import Spinner from '../Spinner';
import { SpeakerIcon } from '../icons/Icons';

interface DifficultWord {
    word: string;
    explanation: string;
    example: string;
}

const DifficultWordsPage = ({ context }: PageProps) => {
    const { passage } = context;
    const [words, setWords] = useState<DifficultWord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [playingWord, setPlayingWord] = useState<string | null>(null);

    useEffect(() => {
        const fetchWords = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const result = await identifyAndExplainDifficultWords(passage.content);
                setWords(result);
            } catch (err) {
                setError('Không thể tải danh sách từ khó. Vui lòng thử lại.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWords();
    }, [passage.content]);

    const handleListenToWord = async (word: string) => {
        if (playingWord) return;
        setPlayingWord(word);
        try {
            const audioBase64 = await generateTextToSpeech(word);
            await playBase64Audio(audioBase64);
        } catch (error) {
            console.error("Failed to play audio for word:", error);
            // You can add a user-facing error message here
        } finally {
            setPlayingWord(null);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Từ khó trong bài</h2>
            <p className="text-center text-gray-600 mb-8 font-semibold">{passage.title}</p>
            
            {isLoading && (
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <Spinner size="md" />
                        <p className="mt-4 text-lg text-gray-600">AI đang tìm các từ khó...</p>
                    </div>
                </div>
            )}

            {error && <p className="text-center text-red-500">{error}</p>}

            {!isLoading && !error && (
                <div className="space-y-6">
                    {words.map((word, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <div className="flex items-center mb-2">
                                <h3 className="text-2xl font-bold text-blue-700">{word.word}</h3>
                                <button
                                    onClick={() => handleListenToWord(word.word)}
                                    disabled={!!playingWord}
                                    className="ml-4 p-2 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                                    title="Nghe phát âm"
                                >
                                    {playingWord === word.word ? <Spinner size="sm" /> : <SpeakerIcon size="sm" />}
                                </button>
                            </div>
                            <p className="text-gray-700 mb-2"><strong className="font-semibold">Giải nghĩa:</strong> {word.explanation}</p>
                            <p className="text-gray-600 italic"><strong className="font-semibold not-italic">Ví dụ:</strong> {word.example}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DifficultWordsPage;