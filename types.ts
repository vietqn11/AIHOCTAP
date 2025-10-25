// FIX: create and export all necessary types and re-export Page from constants to fix module resolution errors.
export { Page } from './constants';

export type User = {
    name: string;
    className: string;
};

export type PageProps = {
    navigate: (page: string, context?: any) => void;
    goBack: () => void;
    goHome: () => void;
    user: User;
    context?: any;
};

export type Passage = {
    id: number;
    title: string;
    volume: number;
    content: string;
};

export type ReadingEvaluation = {
    totalScore: number;
    fluency: number;
    pronunciation: number;
    accuracy: number;
    wordsPerMinute: number;
    generalFeedback: string;
    positivePoints: string;
    wordsToImprove: {
        word: string;
        context: string;
    }[];
};

export type WritingEvaluation = {
    contentScore: number;
    structureScore: number;
    wordingScore: number;
    creativityScore: number;
    feedback: string;
    imageUrl: string;
};

export type HandwrittenEvaluation = {
    transcribedText: string;
    positiveFeedback: string;
    suggestions: string[];
    imageUrl: string;
};


export type RolePlayHistoryLine = {
    original: string;
    spoken: string;
};

export type MentalMathProblem = {
    questionText: string;
    answer: number;
};

export type MentalMathEvaluation = {
    isCorrect: boolean;
    feedbackText: string;
};

export type WordProblem = {
    questionText: string;
    answer: number;
};

export type WordProblemEvaluation = {
    isCorrect: boolean;
    feedbackText: string;
    explanation: string;
};

export type WordProblemHint = {
    hintText: string;
};

export type ObjectIdentificationResult = {
    name: string;
    description: string;
    funFact: string;
};

export type EthicalDilemma = {
    scenario: string;
    choices: string[];
};

export type EthicalFeedback = {
    feedback: string;
};

export type ReadingComprehensionQuestion = {
    question: string;
    options: string[];
    correctOptionIndex: number;
};
