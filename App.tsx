import React, { useState, useCallback, useEffect } from 'react';
import { Page, User } from './types';

// --- Page Imports ---
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import Header from './components/Header';
import ReadingHomePage from './components/reading/ReadingHomePage';
import PassageSelectionPage from './components/reading/PassageSelectionPage';
import DifficultWordsPage from './components/reading/DifficultWordsPage';
import ReadingPage from './components/reading/ReadingPage';
import ResultPage from './components/reading/ResultsPage';
import RolePlayScriptSelectionPage from './components/reading/RolePlayScriptSelectionPage';
import RolePlayReadingPage from './components/reading/RolePlayReadingPage';
import RolePlayResultPage from './components/reading/RolePlayResultsPage';
import WritingHomePage from './components/writing/WritingHomePage';
import WritingTopicSelectionPage from './components/writing/WritingTopicSelectionPage';
import WritingAssistancePage from './components/writing/WritingAssistancePage';
import WritingResultPage from './components/writing/WritingResultPage';
import HandwritingEvaluationPage from './components/writing/HandwritingEvaluationPage';
import WritingOutlinePage from './components/writing/WritingOutlinePage';
import WriteFromImagePage from './components/writing/WriteFromImagePage';
import MathHomePage from './components/math/MathHomePage';
import MentalMathPage from './components/math/MentalMathPage';
import WordProblemLessonSelectionPage from './components/math/WordProblemLessonSelectionPage';
import WordProblemsPage from './components/math/WordProblemPage';
import NatureHomePage from './components/nature/NatureHomePage';
import EthicsHomePage from './components/ethics/EthicsHomePage';
import ArtHomePage from './components/art/ArtHomePage';
import MusicHomePage from './components/music/MusicHomePage';
import PEHomePage from './components/pe/PEHomePage';
import ExperienceHomePage from './components/experience/ExperienceHomePage';
import InformaticsHomePage from './components/informatics/InformaticsHomePage';
import NatureAndSocietyPage from './components/nature/NatureAndSocietyPage';
import EthicsPage from './components/ethics/EthicsPage';
import ArtPage from './components/art/ArtPage';
import MusicPage from './components/music/MusicPage';
import PEPage from './components/pe/PEPage';
import ExperiencePage from './components/experience/ExperiencePage';
import InformaticsPage from './components/informatics/InformaticsPage';

type HistoryState = {
  page: Page;
  context: any;
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryState[]>([{ page: Page.Home, context: null }]);

  const handleLogin = useCallback((name: string, className: string) => {
    const loggedInUser = { name, className };
    setUser(loggedInUser);
    localStorage.setItem('grade2-assistant-user', JSON.stringify(loggedInUser));
    setHistory([{ page: Page.Home, context: null }]);
  }, []);
  
  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('grade2-assistant-user');
    setHistory([{ page: Page.Login, context: null }]);
  }, []);

  useEffect(() => {
      const savedUser = localStorage.getItem('grade2-assistant-user');
      if (savedUser) {
          setUser(JSON.parse(savedUser));
      }
  }, []);

  const navigate = (page: Page, context: any = null) => {
    setHistory(prev => [...prev, { page, context }]);
  };
  
  const goBack = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  };
  
  const goHome = () => {
    setHistory([{ page: Page.Home, context: null }]);
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const currentPageState = history[history.length - 1];
  const { page, context } = currentPageState;
  
  const renderPage = () => {
    const props = { navigate, context, user };
    switch (page) {
        case Page.Home: return <HomePage user={user} navigate={navigate} onLogout={handleLogout} />;
        case Page.ReadingHome: return <ReadingHomePage {...props} />;
        case Page.PassageSelection: return <PassageSelectionPage {...props} />;
        case Page.DifficultWords: return <DifficultWordsPage {...props} />;
        case Page.Reading: return <ReadingPage {...props} />;
        case Page.Result: return <ResultPage {...props} />;
        case Page.RolePlayScriptSelection: return <RolePlayScriptSelectionPage {...props} />;
        case Page.RolePlayReading: return <RolePlayReadingPage {...props} />;
        case Page.RolePlayResult: return <RolePlayResultPage {...props} />;
        case Page.WritingHome: return <WritingHomePage {...props} />;
        case Page.WritingTopicSelection: return <WritingTopicSelectionPage {...props} />;
        case Page.WritingAssistance: return <WritingAssistancePage {...props} />;
        case Page.WritingResult: return <WritingResultPage {...props} />;
        case Page.HandwritingEvaluation: return <HandwritingEvaluationPage {...props} />;
        case Page.WritingOutline: return <WritingOutlinePage {...props} />;
        case Page.WriteFromImage: return <WriteFromImagePage {...props} />;
        case Page.MathHome: return <MathHomePage {...props} />;
        case Page.MentalMath: return <MentalMathPage {...props} />;
        case Page.WordProblemLessonSelection: return <WordProblemLessonSelectionPage {...props} />;
        case Page.WordProblems: return <WordProblemsPage {...props} />;
        case Page.NatureHome: return <NatureHomePage {...props} />;
        case Page.EthicsHome: return <EthicsHomePage {...props} />;
        case Page.ArtHome: return <ArtHomePage {...props} />;
        case Page.MusicHome: return <MusicHomePage {...props} />;
        case Page.PEHome: return <PEHomePage {...props} />;
        case Page.ExperienceHome: return <ExperienceHomePage {...props} />;
        case Page.InformaticsHome: return <InformaticsHomePage {...props} />;
        case Page.NatureAndSociety: return <NatureAndSocietyPage {...props} />;
        case Page.Ethics: return <EthicsPage {...props} />;
        case Page.Art: return <ArtPage {...props} />;
        case Page.Music: return <MusicPage {...props} />;
        case Page.PE: return <PEPage {...props} />;
        case Page.Experience: return <ExperiencePage {...props} />;
        case Page.Informatics: return <InformaticsPage {...props} />;
        default: return <HomePage user={user} navigate={navigate} onLogout={handleLogout} />;
    }
  };
  
  const pageTitleMap: { [key in Page]?: string } = {
      [Page.ReadingHome]: "Luyện Đọc",
      [Page.WritingHome]: "Luyện Viết",
      [Page.MathHome]: "Toán học",
      [Page.NatureHome]: "Tự nhiên & Xã hội",
      [Page.EthicsHome]: "Đạo đức",
      [Page.ArtHome]: "Mĩ thuật",
      [Page.MusicHome]: "Âm nhạc",
      [Page.PEHome]: "Giáo dục thể chất",
      [Page.ExperienceHome]: "Hoạt động Trải nghiệm",
      [Page.InformaticsHome]: "Tin học",
  }
  
  const showBackButton = history.length > 1;
  const showHomeButton = page !== Page.Home;

  return (
    <div className="min-h-screen">
        {page !== Page.Home && (
            <Header
                title={pageTitleMap[page] || "Trợ lý học tập"}
                user={user}
                onLogout={handleLogout}
                showBackButton={showBackButton}
                onBack={goBack}
                showHomeButton={showHomeButton}
                onHome={goHome}
            />
        )}
        {renderPage()}
    </div>
  );
};

export default App;
