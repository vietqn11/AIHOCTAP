import React, { useState, useCallback, useEffect } from 'react';
import { Page } from './constants.js';

// --- Page Imports ---
import LoginPage from './components/LoginPage.jsx';
import HomePage from './components/HomePage.jsx';
import Header from './components/Header.jsx';
import ReadingHomePage from './components/reading/ReadingHomePage.jsx';
import PassageSelectionPage from './components/reading/PassageSelectionPage.jsx';
import DifficultWordsPage from './components/reading/DifficultWordsPage.jsx';
import ReadingPage from './components/reading/ReadingPage.jsx';
import ResultPage from './components/reading/ResultsPage.jsx';
import RolePlayScriptSelectionPage from './components/reading/RolePlayScriptSelectionPage.jsx';
import RolePlayReadingPage from './components/reading/RolePlayReadingPage.jsx';
import RolePlayResultPage from './components/reading/RolePlayResultsPage.jsx';
import WritingHomePage from './components/writing/WritingHomePage.jsx';
import WritingTopicSelectionPage from './components/writing/WritingTopicSelectionPage.jsx';
import WritingAssistancePage from './components/writing/WritingAssistancePage.jsx';
import WritingResultPage from './components/writing/WritingResultPage.jsx';
import HandwritingEvaluationPage from './components/writing/HandwritingEvaluationPage.jsx';
import WritingOutlinePage from './components/writing/WritingOutlinePage.jsx';
import WriteFromImagePage from './components/writing/WriteFromImagePage.jsx';
import MathHomePage from './components/math/MathHomePage.jsx';
import MentalMathPage from './components/math/MentalMathPage.jsx';
import WordProblemLessonSelectionPage from './components/math/WordProblemLessonSelectionPage.jsx';
import WordProblemsPage from './components/math/WordProblemPage.jsx';
import NatureHomePage from './components/nature/NatureHomePage.jsx';
import EthicsHomePage from './components/ethics/EthicsHomePage.jsx';
import ArtHomePage from './components/art/ArtHomePage.jsx';
import MusicHomePage from './components/music/MusicHomePage.jsx';
import PEHomePage from './components/pe/PEHomePage.jsx';
import ExperienceHomePage from './components/experience/ExperienceHomePage.jsx';
import InformaticsHomePage from './components/informatics/InformaticsHomePage.jsx';
import NatureAndSocietyPage from './components/nature/NatureAndSocietyPage.jsx';
import EthicsPage from './components/ethics/EthicsPage.jsx';
import ArtPage from './components/art/ArtPage.jsx';
import MusicPage from './components/music/MusicPage.jsx';
import PEPage from './components/pe/PEPage.jsx';
import ExperiencePage from './components/experience/ExperiencePage.jsx';
import InformaticsPage from './components/informatics/InformaticsPage.jsx';
import ObjectIdentificationPage from './components/nature/ObjectIdentificationPage.jsx';
import EthicalDilemmaPage from './components/ethics/EthicalDilemmaPage.jsx';
import ArtIdeaPage from './components/art/ArtIdeaPage.jsx';
import ImageGenerationPage from './components/art/ImageGenerationPage.jsx';
import WritingEvaluationResultPage from './components/writing/WritingEvaluationResultPage.jsx';
import ReadingComprehensionPage from './components/reading/ReadingComprehensionPage.jsx';

const App = () => {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([{ page: Page.Home, context: null }]);

  const handleLogin = useCallback((name, className) => {
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
      } else {
        setHistory([{ page: Page.Login, context: null }]);
      }
  }, []);

  const navigate = useCallback((page, context = null) => {
    setHistory(prev => [...prev, { page, context }]);
  }, []);
  
  const goBack = useCallback(() => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  }, [history.length]);
  
  const goHome = useCallback(() => {
    setHistory([{ page: Page.Home, context: null }]);
  }, []);

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const currentPageState = history[history.length - 1];
  const { page, context } = currentPageState;
  
  const renderPage = () => {
    const props = { navigate, context, user, goBack, goHome };
    switch (page) {
        case Page.Login: return <LoginPage onLogin={handleLogin} />;
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
        case Page.ObjectIdentification: return <ObjectIdentificationPage {...props} />;
        case Page.EthicalDilemma: return <EthicalDilemmaPage {...props} />;
        case Page.ArtIdea: return <ArtIdeaPage {...props} />;
        case Page.ImageGeneration: return <ImageGenerationPage {...props} />;

        // New Intelligent Feature Pages
        case Page.WritingEvaluationResult: return <WritingEvaluationResultPage {...props} />;
        case Page.ReadingComprehension: return <ReadingComprehensionPage {...props} />;


        default: return <HomePage user={user} navigate={navigate} onLogout={handleLogout} />;
    }
  };
  
  const pageTitleMap = {
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
      [Page.Result]: "Kết quả Luyện đọc",
      [Page.ReadingComprehension]: "Kiểm tra Đọc hiểu",
      [Page.WritingEvaluationResult]: "Kết quả Luyện viết",
  }
  
  const isLoginPage = !user || page === Page.Login;
  const isHomePage = page === Page.Home;

  return (
    <div className="min-h-screen">
        {!isLoginPage && !isHomePage && (
            <Header
                title={pageTitleMap[page] || "Trợ lý học tập"}
                user={user}
                onLogout={handleLogout}
                showBackButton={history.length > 1}
                onBack={goBack}
                showHomeButton={!isHomePage}
                onHome={goHome}
            />
        )}
        {renderPage()}
    </div>
  );
};

export default App;