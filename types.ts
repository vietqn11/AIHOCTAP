
export interface User {
  name: string;
  className: string;
}

export interface Passage {
  id: number;
  title: string;
  content: string;
  volume: 1 | 2;
}

export interface WordToImprove {
  word: string;
  context: string;
}

export interface EvaluationResult {
  totalScore: number;
  fluency: number;
  pronunciation: number;
  accuracy: number;
  generalFeedback: string;
  positivePoints: string;
  wordsToImprove: WordToImprove[];
}

export interface WritingFeedback {
  positiveFeedback: string;
  suggestions: string[];
}

// For Handwriting Evaluation
export interface HandwritingFeedback extends WritingFeedback {
  imageUrl: string;
  transcribedText: string;
}

export interface VocabularySuggestion {
  originalWord: string;
  suggestedWord: string;
  explanation: string;
  example: string;
}

// For Writing Outline
export interface OutlineStep {
  question: string;
  userResponse: string;
}

// For Write from Image
export interface StoryImage {
    prompt: string;
    imageUrl: string;
}

// Math related types
export interface MathProblem {
  operand1: number;
  operand2: number;
  operator: '+' | '-';
  questionText: string; // e.g., "5 + 3 = ?"
  questionSpeech: string; // e.g., "Năm cộng ba bằng mấy?"
  answer: number;
}

export interface MathFeedback {
  isCorrect: boolean;
  feedbackText: string;
}

export interface MathLesson {
  id: number;
  title: string;
  description: string;
}

export interface WordProblem {
  questionText: string;
  answer: number;
}

export interface WordProblemFeedback {
  isCorrect: boolean;
  feedbackText: string;
  explanation: string;
}

export interface WordProblemHint {
  hintText: string;
}

// For Role Play Reading
export interface DialogueLine {
  character: string; // 'AI' or a name for AI, 'USER' for the student
  line: string;
}

export interface DialogueScript {
  id: number;
  title: string;
  characters: [string, string]; // [AI character, User character]
  script: DialogueLine[];
}

export interface RolePlayResult {
  feedback: string;
}

// Data structure for activity cards on subject home pages
export interface ActivityCardData {
  title: string;
  description: string;
  icon: string;
  onClick?: () => void;
  disabled?: boolean;
}


export enum Page {
  Login,
  Home,
  // Tiếng Việt - Luyện Đọc
  ReadingHome,
  PassageSelection,
  DifficultWordsPractice, // New page
  Reading,
  Results,
  RolePlayScriptSelection,
  RolePlayReading,
  RolePlayResults,
  // Tiếng Việt - Tập Làm Văn
  WritingHome,
  WritingTopicSelection,
  WritingAssistance,
  WritingResults,
  HandwritingEvaluation,
  WritingOutline, // New page
  WriteFromImage, // New page
  // Toán
  MathHome,
  MentalMath,
  WordProblemLessonSelection,
  WordProblems,
  // Môn học phụ - Trang chủ
  NatureHome,
  EthicsHome,
  ArtHome,
  MusicHome,
  PEHome,
  ExperienceHome,
  InformaticsHome,
  // Môn học phụ - Trang hoạt động
  NatureAndSociety,
  Ethics,
  Art,
  Music,
  PE,
  Experience,
  Informatics,
}