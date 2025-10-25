
// Ghi chú: Kịch bản Google Apps Script được gọi bởi URL dưới đây có thể được mở rộng.
// Ngoài việc lưu dữ liệu, bạn có thể thêm các hàm vào kịch bản để gọi trực tiếp API Gemini
// cho các tác vụ phía sau hoặc tự động hóa trong bảng tính.
// Điều này hữu ích cho các công việc không yêu cầu phản hồi ngay lập tức cho người dùng.

import { User, EvaluationResult, WritingFeedback } from '../types';

// IMPORTANT: Replace this with your actual Google Apps Script URL.
// You will need to create a separate script or modify your existing one to handle writing submissions.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwtwA0CAIYFYe_Htbod-OcTNi-OrH8SzkPawEFAc0OyeAiISguXiVwlVr3kmXkFSgje/exec';

export async function saveReadingResult(user: User, passageTitle: string, result: EvaluationResult): Promise<void> {
  const formData = new URLSearchParams();
  formData.append('submissionType', 'reading'); // Differentiate submission type
  formData.append('name', user.name);
  formData.append('class', user.className);
  formData.append('passageTitle', passageTitle);
  formData.append('totalScore', result.totalScore.toString());
  formData.append('fluency', result.fluency.toString());
  formData.append('pronunciation', result.pronunciation.toString());
  formData.append('accuracy', result.accuracy.toString());
  formData.append('generalFeedback', result.generalFeedback);
  formData.append('positivePoints', result.positivePoints);
  formData.append('wordsToImprove', result.wordsToImprove.map(w => w.word).join(', '));

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData,
    });
    // Although we don't use the response, checking if it's ok can be useful for debugging
    if (!response.ok) {
        console.error('Failed to submit reading result to Google Sheets.', await response.text());
    }
    console.log('Reading result submitted to Google Sheets.');
  } catch (error) {
    console.error('Error saving reading data to Google Sheets:', error);
  }
}

export async function saveWritingSubmission(user: User, topic: string, submission: string, feedback: WritingFeedback): Promise<void> {
  const formData = new URLSearchParams();
  formData.append('submissionType', 'writing'); // Differentiate submission type
  formData.append('name', user.name);
  formData.append('class', user.className);
  formData.append('topic', topic);
  formData.append('submission', submission);
  formData.append('positiveFeedback', feedback.positiveFeedback);
  formData.append('suggestions', feedback.suggestions.join('; '));

  try {
     const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData,
    });
     if (!response.ok) {
        console.error('Failed to submit writing submission to Google Sheets.', await response.text());
     }
    console.log('Writing submission sent to Google Sheets.');
  } catch (error)
 {
    console.error('Error saving writing data to Google Sheets:', error);
    // Non-critical error, so we don't throw, just log it.
  }
}

export async function saveMathResult(user: User, activity: string, score: number): Promise<void> {
  // Ensure the user played at least one round
  if (score <= 0) {
    return;
  }

  const formData = new URLSearchParams();
  formData.append('submissionType', 'math'); // New submission type
  formData.append('name', user.name);
  formData.append('class', user.className);
  formData.append('activity', activity); // e.g., 'Luyện tính nhẩm' or 'Toán có lời văn'
  formData.append('score', score.toString()); // The number of correct answers

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
        console.error('Failed to submit math result to Google Sheets.', await response.text());
    }
    console.log('Math result submitted to Google Sheets.');
  } catch (error) {
    console.error('Error saving math data to Google Sheets:', error);
  }
}

export async function saveRolePlayResult(user: User, scriptTitle: string, feedback: string): Promise<void> {
  const formData = new URLSearchParams();
  formData.append('submissionType', 'roleplay'); // New submission type
  formData.append('name', user.name);
  formData.append('class', user.className);
  formData.append('scriptTitle', scriptTitle);
  formData.append('feedback', feedback);

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
        console.error('Failed to submit role play result to Google Sheets.', await response.text());
    }
    console.log('Role play result submitted to Google Sheets.');
  } catch (error) {
    console.error('Error saving role play data to Google Sheets:', error);
  }
}
