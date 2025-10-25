import React from 'react';
import { User } from '../types';
import { BackIcon, HomeIcon, LogoutIcon } from './icons/Icons';

type HeaderProps = {
    title: string;
    user: User;
    showHomeButton: boolean;
    onHome: () => void;
    showBackButton: boolean;
    onBack: () => void;
    onLogout: () => void;
};

const Header = ({ title, user, showHomeButton, onHome, showBackButton, onBack, onLogout }: HeaderProps) => (
    <header className="bg-white shadow-md p-4 mb-6 sticky top-0 z-10 w-full">
        <div className="container mx-auto flex justify-between items-center px-4">
            <div className="flex items-center space-x-3">
                {showBackButton && <button onClick={onBack} aria-label="Quay lại" className="p-2 rounded-full hover:bg-gray-200 transition"><BackIcon size="md" /></button>}
                {showHomeButton && !showBackButton && <button onClick={onHome} aria-label="Về trang chủ" className="p-2 rounded-full hover:bg-gray-200 transition"><HomeIcon size="md" /></button>}
                <h1 className="text-xl md:text-2xl font-bold text-blue-800">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-gray-600 hidden sm:block">{`Xin chào, ${user.name}!`}</span>
                <button onClick={onLogout} aria-label="Đăng xuất" className="p-2 rounded-full hover:bg-gray-200 transition"><LogoutIcon size="md" /></button>
            </div>
        </div>
    </header>
);

export default Header;
