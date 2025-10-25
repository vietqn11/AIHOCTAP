// This utility is specifically for playing back audio from Gemini TTS
// which is raw PCM data.

// Base64 decoding
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Decode raw PCM data into an AudioBuffer
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


// Singleton AudioContext to avoid creating multiple contexts
let audioContext: AudioContext | null = null;
const getAudioContext = (): AudioContext => {
    if (!audioContext) {
        // Fix: Cast window to 'any' to access vendor-prefixed webkitAudioContext.
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        // Gemini TTS output is at 24000Hz
        audioContext = new AudioContext({ sampleRate: 24000 });
    }
    return audioContext;
};

export async function playAudioFromBase64(base64String: string): Promise<void> {
  try {
    const ctx = getAudioContext();
    const decodedBytes = decode(base64String);
    // Gemini TTS is mono (1 channel) and 24000Hz
    const audioBuffer = await decodeAudioData(decodedBytes, ctx, 24000, 1);
    
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    
    return new Promise((resolve) => {
        source.onended = () => resolve();
        source.start();
    });

  } catch (error) {
    console.error("Failed to play audio:", error);
    throw error;
  }
}