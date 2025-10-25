export enum Page {
    Login,
    Home,
    ReadingHome,
    PassageSelection,
    DifficultWords,
    Reading,
    Result,
    RolePlayScriptSelection,
    RolePlayReading,
    RolePlayResult,
    WritingHome,
    WritingTopicSelection,
    WritingAssistance,
    WritingResult,
    HandwritingEvaluation,
    WritingOutline,
    WriteFromImage,
    MathHome,
    MentalMath,
    WordProblemLessonSelection,
    WordProblems,
    NatureHome,
    EthicsHome,
    ArtHome,
    MusicHome,
    PEHome,
    ExperienceHome,
    InformaticsHome,
    NatureAndSociety,
    Ethics,
    Art,
    Music,
    PE,
    Experience,
    Informatics,
    ObjectIdentification,
    EthicalDilemma,
    ArtIdea,
    ImageGeneration,

    // New Intelligent Feature Pages
    WritingEvaluationResult,
    ReadingComprehension,
}

export interface User {
    name: string;
    className: string;
}

export interface PageProps {
    navigate: (page: Page, context?: any) => void;
    context: any;
    user: User;
    goBack: () => void;
    goHome: () => void;
}

export interface ReadingEvaluation {
    totalScore: number;
    fluency: number;
    pronunciation: number;
    accuracy: number;
    wordsPerMinute: number;
    generalFeedback: string;
    positivePoints: string;
    wordsToImprove: { word: string; context: string }[];
}

export interface ReadingComprehensionQuestion {
    question: string;
    options: string[];
    correctOptionIndex: number;
}


export interface Passage {
    id: number;
    title: string;
    volume: number;
    content: string;
}

export interface DialogueScript {
    id: number;
    title: string;
    characters: string[];
    script: { character: 'USER' | 'AI'; line: string }[];
}


export interface WritingFeedback {
    positiveFeedback: string;
    suggestions: string[];
}

export interface WritingEvaluation {
    contentScore: number;
    structureScore: number;
    wordingScore: number;
    creativityScore: number;
    feedback: string;
    imageUrl: string;
}


export interface VocabularySuggestion {
    originalWord: string;
    suggestedWord: string;
    explanation: string;
    example: string;
}

export interface OutlineStep {
    question: string;
    userResponse: string;
}

export interface StoryImage {
    prompt: string;
    imageUrl: string;
}

export interface RolePlayFeedback {
    feedback: string;
}

export interface RolePlayHistoryLine {
    original: string;
    spoken: string;
}

export interface HandwrittenEvaluation {
    transcribedText: string;
    positiveFeedback: string;
    suggestions: string[];
    imageUrl: string;
}

export interface MentalMathProblem {
    questionText: string;
    answer: number;
    operand1?: number; 
    operand2?: number; 
}

export interface MentalMathEvaluation {
    isCorrect: boolean;
    feedbackText: string;
}


export interface WordProblem {
    questionText: string;
    answer: number;
}

export interface WordProblemEvaluation {
    isCorrect: boolean;
    feedbackText: string;
    explanation: string;
}

export interface WordProblemHint {
    hintText: string;
}

export interface MathLesson {
    id: number;
    title: string;
    description: string;
}

export interface ObjectIdentificationResult {
    name: string;
    description: string;
    funFact: string;
}

export interface EthicalDilemma {
    scenario: string;
    choices: string[];
}

export interface EthicalFeedback {
    feedback: string;
}
