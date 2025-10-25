
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

const SubjectCard: React.FC<{ title: string; icon: React.ReactNode; onClick: () => void; color: string; }> = ({ title, icon, onClick, color }) => (
  <button
    onClick={onClick}
    className={`group flex flex-col items-center justify-center text-center p-4 aspect-square bg-white rounded-2xl shadow-lg border border-gray-200 transition-all transform hover:-translate-y-2 hover:shadow-2xl hover:border-${color}-300`}
  >
    <div className={`mb-3 w-16 h-16 flex items-center justify-center bg-${color}-100 rounded-full transition-colors group-hover:bg-${color}-500`}>
      <div className={`text-${color}-600 group-hover:text-white transition-colors duration-300 transform group-hover:scale-110`}>
        {icon}
      </div>
    </div>
    <h3 className="text-base font-bold text-gray-800">{title}</h3>
  </button>
);

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
