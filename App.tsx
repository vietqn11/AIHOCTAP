
import React, { useState, useCallback } from 'react';
import { User, Passage, EvaluationResult, Page, WritingFeedback, MathLesson, DialogueScript, RolePlayResult, HandwritingFeedback, OutlineStep, StoryImage } from './types';
import { PASSAGES } from './constants';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
// Reading/Writing Components
import ReadingHomePage from './components/reading/ReadingHomePage';
import PassageSelectionPage from './components/PassageSelectionPage';
import ReadingPage from './components/ReadingPage';
import ResultsPage from './components/ResultsPage';
import DifficultWordsPage from './components/reading/DifficultWordsPage';
import RolePlayScriptSelectionPage from './components/reading/RolePlayScriptSelectionPage';
import RolePlayReadingPage from './components/reading/RolePlayReadingPage';
import RolePlayResultsPage from './components/reading/RolePlayResultsPage';
import WritingHomePage from './components/writing/WritingHomePage';
import WritingTopicSelectionPage from './components/writing/WritingTopicSelectionPage';
import WritingAssistancePage from './components/writing/WritingAssistancePage';
import WritingResultPage from './components/writing/WritingResultPage';
import HandwritingEvaluationPage from './components/writing/HandwritingEvaluationPage';
import WritingOutlinePage from './components/writing/WritingOutlinePage';
import WriteFromImagePage from './components/writing/WriteFromImagePage';
// Math Components
import MathHomePage from './components/math/MathHomePage';
import MentalMathPage from './components/math/MentalMathPage';
import WordProblemLessonSelectionPage from './components/math/WordProblemLessonSelectionPage';
import WordProblemPage from './components/math/WordProblemPage';
// Subject Home Pages
import NatureHomePage from './components/nature/NatureHomePage';
import EthicsHomePage from './components/ethics/EthicsHomePage';
import ArtHomePage from './components/art/ArtHomePage';
import MusicHomePage from './components/music/MusicHomePage';
import PEHomePage from './components/pe/PEHomePage';
import ExperienceHomePage from './components/experience/ExperienceHomePage';
import InformaticsHomePage from './components/informatics/InformaticsHomePage';
// Subject Activity Pages
import NatureAndSocietyPage from './components/nature/NatureAndSocietyPage';
import EthicsPage from './components/ethics/EthicsPage';
import ArtPage from './components/art/ArtPage';
import MusicPage from './components/music/MusicPage';
import PEPage from './components/pe/PEPage';
import ExperiencePage from './components/experience/ExperiencePage';
import InformaticsPage from './components/informatics/InformaticsPage';
import { LogoutIcon } from './components/icons/Icons';
import { extractDifficultWords } from './services/geminiService';
import { saveWritingSubmission, saveRolePlayResult } from './services/googleSheetsService';


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Login);
  
  // Reading state
  const [selectedPassage, setSelectedPassage] = useState<Passage | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [selectedScript, setSelectedScript] = useState<DialogueScript | null>(null);
  const [rolePlayResult, setRolePlayResult] = useState<RolePlayResult | null>(null);
  const [difficultWords, setDifficultWords] = useState<string[] | null>(null);

  // Writing state
  type WritingMode = 'topic' | 'outline' | 'image';
  const [writingMode, setWritingMode] = useState<WritingMode>('topic');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [writingFeedback, setWritingFeedback] = useState<WritingFeedback | null>(null);
  const [handwritingFeedback, setHandwritingFeedback] = useState<HandwritingFeedback | null>(null);
  const [studentSubmission, setStudentSubmission] = useState<string>('');
  const [initialWritingText, setInitialWritingText] = useState<string | null>(null);
  const [storyImage, setStoryImage] = useState<StoryImage | null>(null);

  // Math state
  const [mentalMathScore, setMentalMathScore] = useState(0);
  const [wordProblemScore, setWordProblemScore] = useState(0);
  const [selectedMathLesson, setSelectedMathLesson] = useState<MathLesson | null>(null);

  const resetAllActivityStates = () => {
    setSelectedPassage(null);
    setEvaluationResult(null);
    setSelectedScript(null);
    setRolePlayResult(null);
    setDifficultWords(null);
    setSelectedTopic(null);
    setWritingFeedback(null);
    setHandwritingFeedback(null);
    setStudentSubmission('');
    setInitialWritingText(null);
    setStoryImage(null);
    setMentalMathScore(0);
    setWordProblemScore(0);
    setSelectedMathLesson(null);
  };

  const handleLogin = useCallback((name: string, className: string) => {
    setUser({ name, className });
    setCurrentPage(Page.Home);
  }, []);

  const handleLogout = useCallback(() => {
    resetAllActivityStates();
    setUser(null);
    setCurrentPage(Page.Login);
  }, []);

  // Navigation handlers
  const navigateToReadingHome = useCallback(() => setCurrentPage(Page.ReadingHome), []);
  const navigateToWritingHome = useCallback(() => setCurrentPage(Page.WritingHome), []);
  const navigateToMathHome = useCallback(() => setCurrentPage(Page.MathHome), []);
  
  // Subject Home Navigation
  const navigateToNatureHome = useCallback(() => setCurrentPage(Page.NatureHome), []);
  const navigateToEthicsHome = useCallback(() => setCurrentPage(Page.EthicsHome), []);
  const navigateToArtHome = useCallback(() => setCurrentPage(Page.ArtHome), []);
  const navigateToMusicHome = useCallback(() => setCurrentPage(Page.MusicHome), []);
  const navigateToPEHome = useCallback(() => setCurrentPage(Page.PEHome), []);
  const navigateToExperienceHome = useCallback(() => setCurrentPage(Page.ExperienceHome), []);
  const navigateToInformaticsHome = useCallback(() => setCurrentPage(Page.InformaticsHome), []);

  // Subject Activity Navigation
  const navigateToNatureChat = useCallback(() => setCurrentPage(Page.NatureAndSociety), []);
  const navigateToEthicsDilemma = useCallback(() => setCurrentPage(Page.Ethics), []);
  const navigateToArtColoring = useCallback(() => setCurrentPage(Page.Art), []);
  const navigateToMusicQuiz = useCallback(() => setCurrentPage(Page.Music), []);
  const navigateToPEActivity = useCallback(() => setCurrentPage(Page.PE), []);
  const navigateToExperienceActivity = useCallback(() => setCurrentPage(Page.Experience), []);
  const navigateToInformaticsTyping = useCallback(() => setCurrentPage(Page.Informatics), []);

  const navigateHome = useCallback(() => {
    resetAllActivityStates();
    setCurrentPage(Page.Home);
  }, []);

  // Reading handlers
  const handleSelectPassage = useCallback(async (passage: Passage) => {
    setSelectedPassage(passage);
    try {
      const words = await extractDifficultWords(passage.content);
      setDifficultWords(words);
      setCurrentPage(Page.DifficultWordsPractice);
    } catch (error) {
      console.error("Failed to extract difficult words, skipping to reading.", error);
      setCurrentPage(Page.Reading);
    }
  }, []);
  
  const handleFinishDifficultWords = useCallback(() => {
    setCurrentPage(Page.Reading);
  }, []);

  const handleFinishReading = useCallback((result: EvaluationResult) => {
    setEvaluationResult(result);
    setCurrentPage(Page.Results);
  }, []);

  const handleSelectScript = useCallback((script: DialogueScript) => {
    setSelectedScript(script);
    setCurrentPage(Page.RolePlayReading);
  }, []);

  const handleFinishRolePlay = useCallback(async (result: RolePlayResult) => {
    setRolePlayResult(result);
    if (user && selectedScript) {
      await saveRolePlayResult(user, selectedScript.title, result.feedback);
    }
    setCurrentPage(Page.RolePlayResults);
  }, [user, selectedScript]);

  // Writing handlers
  const handleStartWriting = (mode: WritingMode) => {
    setWritingMode(mode);
    setInitialWritingText(null);
    if (mode === 'image') {
        setCurrentPage(Page.WriteFromImage);
    } else {
        setCurrentPage(Page.WritingTopicSelection);
    }
  };

  const handleSelectTopic = useCallback((topic: string) => {
    setSelectedTopic(topic);
    if (writingMode === 'outline') {
        setCurrentPage(Page.WritingOutline);
    } else {
        setCurrentPage(Page.WritingAssistance);
    }
  }, [writingMode]);
  
  const handleFinishOutline = useCallback((outlineText: string) => {
      setInitialWritingText(outlineText);
      setCurrentPage(Page.WritingAssistance);
  }, []);

  const handleFinishWriting = useCallback((submission: string, feedback: WritingFeedback) => {
    setStudentSubmission(submission);
    setWritingFeedback(feedback);
    setHandwritingFeedback(null); // Clear handwriting feedback
    setCurrentPage(Page.WritingResults);
  }, []);

  const handleFinishHandwriting = useCallback(async (feedback: HandwritingFeedback) => {
    setHandwritingFeedback(feedback);
    setWritingFeedback(null); // Clear regular feedback
    if (user) {
        await saveWritingSubmission(user, "Bài viết tay", feedback.transcribedText, feedback);
    }
    setCurrentPage(Page.WritingResults);
  }, [user]);


  // Math handlers
  const handleSelectMathLesson = useCallback((lesson: MathLesson) => {
    setSelectedMathLesson(lesson);
    setCurrentPage(Page.WordProblems);
  }, []);


  const renderPage = () => {
    const mainHomeNavProps = {
        onNavigateToReading: navigateToReadingHome,
        onNavigateToWriting: navigateToWritingHome,
        onNavigateToMath: navigateToMathHome,
        onNavigateToNature: navigateToNatureHome,
        onNavigateToEthics: navigateToEthicsHome,
        onNavigateToArt: navigateToArtHome,
        onNavigateToMusic: navigateToMusicHome,
        onNavigateToPE: navigateToPEHome,
        onNavigateToExperience: navigateToExperienceHome,
        onNavigateToInformatics: navigateToInformaticsHome
    };

    switch (currentPage) {
      case Page.Login:
        return <LoginPage onLogin={handleLogin} />;
      case Page.Home:
        return <HomePage {...mainHomeNavProps} />;
      
      // Tiếng Việt Flow
      case Page.ReadingHome:
        return <ReadingHomePage onBack={navigateHome} onNavigateToPassageSelection={() => setCurrentPage(Page.PassageSelection)} onNavigateToRolePlay={() => setCurrentPage(Page.RolePlayScriptSelection)} />;
      case Page.PassageSelection:
        if (user) return <PassageSelectionPage user={user} passages={PASSAGES} onSelectPassage={handleSelectPassage} onBack={() => setCurrentPage(Page.ReadingHome)} />;
        break;
      case Page.DifficultWordsPractice:
        if (user && difficultWords) return <DifficultWordsPage words={difficultWords} onFinish={handleFinishDifficultWords} onBack={() => setCurrentPage(Page.PassageSelection)} />;
        break;
      case Page.Reading:
        if (user && selectedPassage) return <ReadingPage user={user} passage={selectedPassage} onFinishReading={handleFinishReading} />;
        break;
      case Page.Results:
        if (user && selectedPassage && evaluationResult) return <ResultsPage user={user} passage={selectedPassage} result={evaluationResult} onStartOver={() => setCurrentPage(Page.PassageSelection)} />;
        break;
      case Page.RolePlayScriptSelection:
        if (user) return <RolePlayScriptSelectionPage onSelectScript={handleSelectScript} onBack={() => setCurrentPage(Page.ReadingHome)} />;
        break;
      case Page.RolePlayReading:
        if (user && selectedScript) return <RolePlayReadingPage user={user} script={selectedScript} onFinish={handleFinishRolePlay} />;
        break;
      case Page.RolePlayResults:
        if (user && selectedScript && rolePlayResult) return <RolePlayResultsPage user={user} script={selectedScript} result={rolePlayResult} onStartOver={() => setCurrentPage(Page.RolePlayScriptSelection)} />;
        break;

      case Page.WritingHome:
         if (user) return <WritingHomePage onBack={navigateHome} onStartWriting={handleStartWriting} onNavigateToHandwriting={() => setCurrentPage(Page.HandwritingEvaluation)} />;
         break;
      case Page.WritingTopicSelection:
        if (user) return <WritingTopicSelectionPage onSelectTopic={handleSelectTopic} onBack={() => setCurrentPage(Page.WritingHome)} />;
        break;
      case Page.WritingOutline:
        if (user && selectedTopic) return <WritingOutlinePage user={user} topic={selectedTopic} onFinish={handleFinishOutline} onBack={() => setCurrentPage(Page.WritingTopicSelection)} />;
        break;
      case Page.WriteFromImage:
        if(user) return <WriteFromImagePage user={user} onFinishWriting={handleFinishWriting} onBack={() => setCurrentPage(Page.WritingHome)} />;
        break;
      case Page.WritingAssistance:
        if (user && selectedTopic) return <WritingAssistancePage user={user} topic={selectedTopic} initialText={initialWritingText} onFinishWriting={handleFinishWriting} onBack={() => setCurrentPage(writingMode === 'outline' ? Page.WritingOutline : Page.WritingTopicSelection)} />;
        break;
      case Page.HandwritingEvaluation:
        if (user) return <HandwritingEvaluationPage user={user} onBack={() => setCurrentPage(Page.WritingHome)} onFinish={handleFinishHandwriting} />;
        break;
      case Page.WritingResults:
        if (user) {
            const startOverPage = writingMode === 'image' ? Page.WriteFromImage : Page.WritingTopicSelection;
            if (writingFeedback) {
                 return <WritingResultPage user={user} topic={selectedTopic || "Bài viết"} submission={studentSubmission} feedback={writingFeedback} onStartOver={() => setCurrentPage(startOverPage)} />;
            }
            if (handwritingFeedback) {
                return <WritingResultPage user={user} topic="Bài viết tay" submission="" feedback={handwritingFeedback} onStartOver={() => setCurrentPage(Page.WritingHome)} />;
            }
        }
        break;
      
      // Toán Flow
      case Page.MathHome:
        if (user) return <MathHomePage onStartMentalMath={() => setCurrentPage(Page.MentalMath)} onStartWordProblems={() => setCurrentPage(Page.WordProblemLessonSelection)} onBack={navigateHome}/>;
        break;
      case Page.MentalMath:
        if (user) return <MentalMathPage user={user} score={mentalMathScore} setScore={setMentalMathScore} onBack={() => setCurrentPage(Page.MathHome)} />;
        break;
      case Page.WordProblemLessonSelection:
        if (user) return <WordProblemLessonSelectionPage onSelectLesson={handleSelectMathLesson} onBack={() => setCurrentPage(Page.MathHome)} />;
        break;
      case Page.WordProblems:
        if (user && selectedMathLesson) return <WordProblemPage user={user} lesson={selectedMathLesson} score={wordProblemScore} setScore={setWordProblemScore} onBack={() => setCurrentPage(Page.WordProblemLessonSelection)} />;
        break;

      // Other Subjects Home Pages
      case Page.NatureHome: return <NatureHomePage onBack={navigateHome} onNavigateToActivity={navigateToNatureChat}/>;
      case Page.EthicsHome: return <EthicsHomePage onBack={navigateHome} onNavigateToActivity={navigateToEthicsDilemma}/>;
      case Page.ArtHome: return <ArtHomePage onBack={navigateHome} onNavigateToActivity={navigateToArtColoring} />;
      case Page.MusicHome: return <MusicHomePage onBack={navigateHome} onNavigateToActivity={navigateToMusicQuiz}/>;
      case Page.PEHome: return <PEHomePage onBack={navigateHome} onNavigateToActivity={navigateToPEActivity}/>;
      case Page.ExperienceHome: return <ExperienceHomePage onBack={navigateHome} onNavigateToActivity={navigateToExperienceActivity}/>;
      case Page.InformaticsHome: return <InformaticsHomePage onBack={navigateHome} onNavigateToActivity={navigateToInformaticsTyping}/>;
        
      // Other Subjects Activity Pages
      case Page.NatureAndSociety: return <NatureAndSocietyPage onBack={navigateToNatureHome} />;
      case Page.Ethics: return <EthicsPage onBack={navigateToEthicsHome} />;
      case Page.Art: return <ArtPage onBack={navigateToArtHome} />;
      case Page.Music: return <MusicPage onBack={navigateToMusicHome} />;
      case Page.PE: return <PEPage onBack={navigateToPEHome} />;
      case Page.Experience: return <ExperiencePage onBack={navigateToExperienceHome} />;
      case Page.Informatics: return <InformaticsPage onBack={navigateToInformaticsHome} />;

    }
    // Default fallback
    return <LoginPage onLogin={handleLogin} />;
  };

  return (
    <div className="min-h-screen font-sans text-gray-800">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4z" />
            </svg>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Moi: Trợ lý học tập Lớp 2</h1>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              {currentPage !== Page.Login && currentPage !== Page.Home && (
                 <button onClick={navigateHome} className="text-sm font-medium text-blue-600 hover:underline">Trang chủ</button>
              )}
              <div className="text-sm md:text-base text-right"><p className="font-semibold">{user.name}</p><p className="text-gray-600">Lớp {user.className}</p></div>
              <button onClick={handleLogout} title="Đổi học sinh" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors">
                  <LogoutIcon /> 
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
