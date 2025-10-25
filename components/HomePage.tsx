import React from 'react';
import { ArtIcon, EthicsIcon, ExperienceIcon, InformaticsIcon, MathIcon, MusicIcon, NatureIcon, PEIcon, ReadingIcon, WritingIcon } from './icons/Icons';

interface HomePageProps {
  onNavigateToReading: () => void;
  onNavigateToWriting: () => void;
  onNavigateToMath: () => void;
  onNavigateToNature: () => void;
  onNavigateToEthics: () => void;
  onNavigateToArt: () => void;
  onNavigateToMusic: () => void;
  onNavigateToPE: () => void;
  onNavigateToExperience: () => void;
  onNavigateToInformatics: () => void;
}

// Define a map for full, static class names to avoid Tailwind JIT issues with dynamic classes.
const colorMap: { [key: string]: { border: string; bg: string; groupHoverBg: string; text: string; } } = {
  blue: { border: 'hover:border-blue-300', bg: 'bg-blue-100', groupHoverBg: 'group-hover:bg-blue-500', text: 'text-blue-600' },
  green: { border: 'hover:border-green-300', bg: 'bg-green-100', groupHoverBg: 'group-hover:bg-green-500', text: 'text-green-600' },
  purple: { border: 'hover:border-purple-300', bg: 'bg-purple-100', groupHoverBg: 'group-hover:bg-purple-500', text: 'text-purple-600' },
  teal: { border: 'hover:border-teal-300', bg: 'bg-teal-100', groupHoverBg: 'group-hover:bg-teal-500', text: 'text-teal-600' },
  pink: { border: 'hover:border-pink-300', bg: 'bg-pink-100', groupHoverBg: 'group-hover:bg-pink-500', text: 'text-pink-600' },
  orange: { border: 'hover:border-orange-300', bg: 'bg-orange-100', groupHoverBg: 'group-hover:bg-orange-500', text: 'text-orange-600' },
  red: { border: 'hover:border-red-300', bg: 'bg-red-100', groupHoverBg: 'group-hover:bg-red-500', text: 'text-red-600' },
  yellow: { border: 'hover:border-yellow-300', bg: 'bg-yellow-100', groupHoverBg: 'group-hover:bg-yellow-500', text: 'text-yellow-600' },
  indigo: { border: 'hover:border-indigo-300', bg: 'bg-indigo-100', groupHoverBg: 'group-hover:bg-indigo-500', text: 'text-indigo-600' },
  gray: { border: 'hover:border-gray-300', bg: 'bg-gray-100', groupHoverBg: 'group-hover:bg-gray-500', text: 'text-gray-600' },
};


const SubjectCard: React.FC<{ title: string; icon: React.ReactNode; onClick: () => void; color: string; }> = ({ title, icon, onClick, color }) => {
    const colors = colorMap[color] || colorMap.gray; // Fallback to gray for safety
    return (
      <button
        onClick={onClick}
        className={`group flex flex-col items-center justify-center text-center p-4 aspect-square bg-white rounded-2xl shadow-lg border border-gray-200 transition-all transform hover:-translate-y-2 hover:shadow-2xl ${colors.border}`}
      >
        <div className={`mb-3 w-16 h-16 flex items-center justify-center rounded-full transition-colors ${colors.bg} ${colors.groupHoverBg}`}>
          <div className={`group-hover:text-white transition-colors duration-300 transform group-hover:scale-110 ${colors.text}`}>
            {icon}
          </div>
        </div>
        <h3 className="text-base font-bold text-gray-800">{title}</h3>
      </button>
    );
};

const HomePage: React.FC<HomePageProps> = (props) => {
  const subjects = [
    { title: "Luyện Đọc", icon: <ReadingIcon size="lg" />, onClick: props.onNavigateToReading, color: "blue" },
    { title: "Tập Làm Văn", icon: <WritingIcon size="lg" />, onClick: props.onNavigateToWriting, color: "green" },
    { title: "Bé Tính Giỏi", icon: <MathIcon size="lg" />, onClick: props.onNavigateToMath, color: "purple" },
    { title: "Tự nhiên & Xã hội", icon: <NatureIcon size="lg" />, onClick: props.onNavigateToNature, color: "teal" },
    { title: "Đạo đức", icon: <EthicsIcon size="lg" />, onClick: props.onNavigateToEthics, color: "pink" },
    { title: "Mỹ thuật", icon: <ArtIcon size="lg" />, onClick: props.onNavigateToArt, color: "orange" },
    { title: "Âm nhạc", icon: <MusicIcon size="lg" />, onClick: props.onNavigateToMusic, color: "red" },
    { title: "Thể dục", icon: <PEIcon size="lg" />, onClick: props.onNavigateToPE, color: "yellow" },
    { title: "Hoạt động Trải nghiệm", icon: <ExperienceIcon size="lg" />, onClick: props.onNavigateToExperience, color: "indigo" },
    { title: "Tin học", icon: <InformaticsIcon size="lg" />, onClick: props.onNavigateToInformatics, color: "gray" },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-8">
      <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Bé muốn học môn gì hôm nay?</h2>
          <p className="text-gray-500 mt-2">Chọn một môn học để bắt đầu cuộc phiêu lưu!</p>
      </div>
      <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {subjects.map(subject => (
          <SubjectCard key={subject.title} {...subject} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;