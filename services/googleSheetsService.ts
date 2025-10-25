import { User, WritingEvaluation, ReadingEvaluation, RolePlayHistoryLine } from "../types";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtwA0CAIYFYe_Htbod-OcTNi-OrH8SzkPawEFAc0OyeAiISguXiVwlVr3kmXkFSgje/exec";

const submitData = async (formData: FormData) => {
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        if (result.result !== 'success') {
            console.error('Google Sheets API Error:', result.message);
        } else {
            console.log('Successfully saved to Google Sheets.');
        }
    } catch (error) {
        console.error('Failed to submit data to Google Sheets:', error);
        throw error; // Re-throw to be caught by the UI
    }
};

export const submitWritingResult = (user: User, topic: string, writtenText: string, evaluation: WritingEvaluation) => {
    const formData = new FormData();
    formData.append('submissionType', 'writing');
    formData.append('name', user.name);
    formData.append('class', user.className);
    formData.append('topic', topic);
    formData.append('submission', writtenText);
    formData.append('positiveFeedback', evaluation.feedback); 
    formData.append('suggestions', ''); 
    
    return submitData(formData);
};

export const submitReadingResult = (user: User, passageTitle: string, evaluation: ReadingEvaluation) => {
    const formData = new FormData();
    formData.append('submissionType', 'reading');
    formData.append('name', user.name);
    formData.append('class', user.className);
    formData.append('passageTitle', passageTitle);
    formData.append('totalScore', String(evaluation.totalScore));
    formData.append('fluency', String(evaluation.fluency));
    formData.append('pronunciation', String(evaluation.pronunciation));
    formData.append('accuracy', String(evaluation.accuracy));
    formData.append('generalFeedback', evaluation.generalFeedback);
    formData.append('positivePoints', evaluation.positivePoints);
    const wordsToImproveStr = evaluation.wordsToImprove.map(w => w.word).join(', ');
    formData.append('wordsToImprove', wordsToImproveStr);

    return submitData(formData);
};

export const submitMathResult = (user: User, activity: string, score: number) => {
    const formData = new FormData();
    formData.append('submissionType', 'math');
    formData.append('name', user.name);
    formData.append('class', user.className);
    formData.append('activity', activity);
    formData.append('score', String(score));
    
    return submitData(formData);
};

export const submitRolePlayResult = (user: User, scriptTitle: string, feedback: string) => {
    const formData = new FormData();
    formData.append('submissionType', 'roleplay');
    formData.append('name', user.name);
    formData.append('class', user.className);
    formData.append('scriptTitle', scriptTitle);
    formData.append('feedback', feedback);

    return submitData(formData);
};
