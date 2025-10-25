let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

const SUPPORTED_MIME_TYPES = [
    'audio/mp4', // Preferred for Safari
    'audio/webm',
    'audio/ogg',
];

let selectedMimeType = 'audio/webm'; // Default

export const getSupportedMimeType = () => {
    if (typeof MediaRecorder === 'undefined') {
        console.warn("MediaRecorder API not supported");
        return 'audio/webm'; // return default
    }
    for (const type of SUPPORTED_MIME_TYPES) {
        if (MediaRecorder.isTypeSupported(type)) {
            selectedMimeType = type;
            return type;
        }
    }
    console.warn("No supported MIME type found, falling back to default");
    return selectedMimeType;
};

// Initialize the mimeType once.
getSupportedMimeType();


export const startRecording = async (): Promise<void> => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream, { mimeType: selectedMimeType });
            audioChunks = [];

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.start();
        } catch (err) {
            console.error("Error accessing microphone:", err);
            throw err;
        }
    } else {
        throw new Error("Audio recording is not supported by this browser.");
    }
};

export const stopRecording = (): Promise<Blob> => {
    return new Promise(resolve => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: selectedMimeType });
                resolve(audioBlob);
                // Clean up stream tracks
                if(mediaRecorder.stream) {
                    mediaRecorder.stream.getTracks().forEach(track => track.stop());
                }
            };
            mediaRecorder.stop();
        } else {
            // If already stopped or not initialized, resolve with an empty blob.
            resolve(new Blob(audioChunks, { type: selectedMimeType }));
        }
    });
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

// --- Audio Playback ---

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


export const playBase64Audio = (base64Audio: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                outputAudioContext,
                24000,
                1,
            );
            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContext.destination);
            source.start();
            source.onended = () => {
                outputAudioContext.close();
                resolve();
            };
        } catch (error) {
            console.error("Error playing audio:", error);
            reject(error);
        }
    });
};