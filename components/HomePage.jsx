import React from 'react';
import { Page } from '../constants.js';
import {
    ReadingIcon, WritingIcon, MathIcon, NatureIcon, EthicsIcon,
    ArtIcon, MusicIcon, PEIcon, ExperienceIcon, InformaticsIcon
} from './icons/Icons.jsx';
import Header from './Header.jsx';

const HomePage = ({ user, navigate, onLogout }) => {
    const subjects = [
        { name: "Luyện Đọc", icon: <ReadingIcon size='xl' />, page: Page.ReadingHome, color: "from-sky-400 to-blue-500" },
        { name: "Luyện Viết", icon: <WritingIcon size='xl' />, page: Page.WritingHome, color: "from-amber-400 to-orange-500" },
        { name: "Toán học", icon: <MathIcon size='xl' />, page: Page.MathHome, color: "from-indigo-400 to-purple-500" },
        { name: "Tự nhiên & Xã hội", icon: <NatureIcon size='xl' />, page: Page.NatureHome, color: "from-green-400 to-emerald-500" },
        { name: "Đạo đức", icon: <EthicsIcon size='xl' />, page: Page.EthicsHome, color: "from-rose-400 to-red-500" },
        { name: "Mĩ thuật", icon: <ArtIcon size='xl' />, page: Page.ArtHome, color: "from-fuchsia-400 to-pink-500" },
        { name: "Âm nhạc", icon: <MusicIcon size='xl' />, page: Page.MusicHome, color: "from-violet-400 to-purple-500" },
        { name: "Giáo dục thể chất", icon: <PEIcon size='xl' />, page: Page.PEHome, color: "from-teal-400 to-cyan-500" },
        { name: "HĐ Trải nghiệm", icon: <ExperienceIcon size='xl' />, page: Page.ExperienceHome, color: "from-lime-400 to-green-500" },
        { name: "Tin học", icon: <InformaticsIcon size='xl' />, page: Page.InformaticsHome, color: "from-slate-400 to-gray-500" },
    ];

    return (
        <div className="min-h-screen">
            <Header title="Trang chủ" user={user} onLogout={onLogout} showBackButton={false} onBack={() => {}} showHomeButton={false} onHome={() => {}} />
            <main className="container mx-auto px-4 pb-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {subjects.map(subject => (
                        <button
                            key={subject.name}
                            onClick={() => navigate(subject.page)}
                            className={`bg-gradient-to-br ${subject.color} text-white rounded-xl shadow-lg p-4 flex flex-col items-center justify-center aspect-square transition-transform transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-blue-300`}
                        >
                            <div className="mb-2">{subject.icon}</div>
                            <span className="font-semibold text-center text-sm md:text-base">{subject.name}</span>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default HomePage;