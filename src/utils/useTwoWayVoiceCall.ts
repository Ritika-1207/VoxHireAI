import { useState, useEffect, useRef, useCallback } from 'react';
import { speakNaturalConversational, stopNaturalSpeech } from './voiceSynthesis';

export type VoiceCallStatus =
  | 'idle'
  | 'requesting_permission'
  | 'listening'
  | 'user_speaking'
  | 'thinking'
  | 'ai_speaking'
  | 'interrupted'
  | 'permission_denied';

export interface ConversationTurn {
  id: string;
  speaker: 'ai' | 'candidate';
  text: string;
  time: string;
  interrupted?: boolean;
}

export function useTwoWayVoiceCall() {
  const [callActive, setCallActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<VoiceCallStatus>('idle');
  const [seconds, setSeconds] = useState(0);
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [micPermissionGranted, setMicPermissionGranted] = useState<boolean | null>(null);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  // References to keep event handlers fresh and avoid closure staleness
  const callActiveRef = useRef(false);
  const isMicMutedRef = useRef(false);
  const isAiSpeakingRef = useRef(false);
  const turnsRef = useRef<ConversationTurn[]>([]);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const pendingUserSpeechRef = useRef<string>('');
  const timerIntervalRef = useRef<any>(null);

  // Keep refs synchronized
  useEffect(() => {
    callActiveRef.current = callActive;
  }, [callActive]);

  useEffect(() => {
    isMicMutedRef.current = isMicMuted;
  }, [isMicMuted]);

  useEffect(() => {
    turnsRef.current = turns;
  }, [turns]);

  // Audio activity level simulator
  useEffect(() => {
    if (!callActive) {
      setAudioLevel(0);
      return;
    }

    const interval = setInterval(() => {
      if (voiceStatus === 'ai_speaking') {
        setAudioLevel(0.4 + Math.random() * 0.55);
      } else if (voiceStatus === 'user_speaking') {
        setAudioLevel(0.35 + Math.random() * 0.6);
      } else if (voiceStatus === 'thinking') {
        setAudioLevel(0.15 + Math.sin(Date.now() / 200) * 0.1);
      } else {
        setAudioLevel(0.05 + Math.random() * 0.08);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [callActive, voiceStatus]);

  // Timer counter
  useEffect(() => {
    if (callActive) {
      timerIntervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [callActive]);

  const formatTimer = (sec: number): string => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Stop everything on unmount
  useEffect(() => {
    return () => {
      stopNaturalSpeech();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // Handle interruption
  const interruptAiSpeech = useCallback(() => {
    if (isAiSpeakingRef.current) {
      stopNaturalSpeech();
      isAiSpeakingRef.current = false;
      setVoiceStatus('interrupted');

      // Mark the latest turn as interrupted
      setTurns((prev) => {
        if (prev.length === 0) return prev;
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last.speaker === 'ai') {
          copy[copy.length - 1] = { ...last, interrupted: true };
        }
        return copy;
      });
    }
  }, []);

  // Process user input and request Gemini response
  const processUserMessage = useCallback(async (userMessageText: string) => {
    const cleanedText = userMessageText.trim();
    if (!cleanedText) return;

    // Reset pending speech and interim
    pendingUserSpeechRef.current = '';
    setInterimTranscript('');

    const currentTime = formatTimer(seconds);
    const newTurn: ConversationTurn = {
      id: `turn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      speaker: 'candidate',
      text: cleanedText,
      time: currentTime,
    };

    const updatedHistory = [...turnsRef.current, newTurn];
    setTurns(updatedHistory);
    setVoiceStatus('thinking');

    try {
      const response = await fetch('/api/chat/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage: cleanedText,
          history: updatedHistory.map((t) => ({ speaker: t.speaker, text: t.text })),
        }),
      });

      const data = await response.json();
      const aiReply: string =
        data.reply ||
        "Thank you for sharing that! Could you tell me a little about your notice period or earliest start date?";

      if (!callActiveRef.current) return;

      const aiTurn: ConversationTurn = {
        id: `turn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        speaker: 'ai',
        text: aiReply,
        time: formatTimer(seconds + 1),
      };

      setTurns((prev) => [...prev, aiTurn]);
      setVoiceStatus('ai_speaking');
      isAiSpeakingRef.current = true;

      speakNaturalConversational(aiReply, 'en', {
        onStart: () => {
          if (!callActiveRef.current) {
            stopNaturalSpeech();
            return;
          }
          isAiSpeakingRef.current = true;
          setVoiceStatus('ai_speaking');
        },
        onEnd: () => {
          isAiSpeakingRef.current = false;
          if (callActiveRef.current) {
            setVoiceStatus('listening');
          }
        },
        onError: () => {
          isAiSpeakingRef.current = false;
          if (callActiveRef.current) {
            setVoiceStatus('listening');
          }
        },
      });
    } catch (err) {
      console.error('Error fetching AI response:', err);
      if (callActiveRef.current) {
        setVoiceStatus('listening');
      }
    }
  }, [seconds]);

  // Schedule processing after user pauses speaking
  const scheduleSpeechProcessing = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    silenceTimerRef.current = setTimeout(() => {
      if (pendingUserSpeechRef.current.trim() && callActiveRef.current) {
        const fullText = pendingUserSpeechRef.current.trim();
        processUserMessage(fullText);
      }
    }, 1100); // 1.1s of silence indicates finished turn
  }, [processUserMessage]);

  // Request explicit microphone access across iOS, Android, and desktop browsers
  const requestMicrophoneAccess = useCallback(async (): Promise<boolean> => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return true; // Let SpeechRecognition attempt directly
    }

    setVoiceStatus('requesting_permission');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Release test tracks immediately
      stream.getTracks().forEach((track) => track.stop());
      setMicPermissionGranted(true);
      setMicPermissionError(null);
      return true;
    } catch (err: any) {
      console.warn('Microphone permission check result:', err);
      setMicPermissionGranted(false);
      setVoiceStatus('permission_denied');

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicPermissionError('Microphone permission was denied. Tap the lock icon in your browser address bar to allow microphone access, or use the text input below.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setMicPermissionError('No microphone was detected on this device. You can type answers and listen to Aria speak.');
      } else {
        setMicPermissionError('Microphone could not be accessed. You can converse with Aria using the live chat input below.');
      }
      return false;
    }
  }, []);

  // Initialize Speech Recognition
  const initSpeechRecognition = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicSupported(false);
      setMicPermissionError('Speech recognition is not supported in this browser. You can type your responses below and hear Aria speak.');
      return null;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setMicPermissionError(null);
        setMicPermissionGranted(true);
        if (callActiveRef.current && !isAiSpeakingRef.current) {
          setVoiceStatus('listening');
        }
      };

      recognition.onspeechstart = () => {
        // User started speaking! Interrupt AI if it's currently talking
        interruptAiSpeech();
        setVoiceStatus('user_speaking');
      };

      recognition.onresult = (event: any) => {
        if (!callActiveRef.current || isMicMutedRef.current) return;

        let interim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += ' ' + transcriptPiece;
          } else {
            interim += transcriptPiece;
          }
        }

        // If user speaks while AI was talking, interrupt immediately
        if (interim.trim() || finalChunk.trim()) {
          interruptAiSpeech();
          setVoiceStatus('user_speaking');
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (finalChunk.trim()) {
          pendingUserSpeechRef.current = (
            pendingUserSpeechRef.current + ' ' + finalChunk.trim()
          ).trim();
          setInterimTranscript(pendingUserSpeechRef.current);
        }

        // Reset and schedule debounced turn evaluation
        scheduleSpeechProcessing();
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setMicPermissionGranted(false);
          setVoiceStatus('permission_denied');
          setMicPermissionError('Microphone permission was denied. Tap the lock icon in your browser address bar to allow microphone access, or use the text input below.');
        } else if (event.error !== 'no-speech') {
          console.warn('Speech recognition warning:', event.error);
        }
      };

      recognition.onend = () => {
        // Automatically restart listening if call is active and mic is not muted
        if (callActiveRef.current && !isMicMutedRef.current) {
          try {
            recognition.start();
          } catch (e) {
            // Already starting
          }
        }
      };

      return recognition;
    } catch (err) {
      console.warn('Failed to initialize SpeechRecognition:', err);
      setMicSupported(false);
      return null;
    }
  }, [interruptAiSpeech, scheduleSpeechProcessing]);

  // Start Call
  const startCall = useCallback(async () => {
    stopNaturalSpeech();
    isAiSpeakingRef.current = false;
    pendingUserSpeechRef.current = '';
    setInterimTranscript('');
    setTurns([]);
    setSeconds(0);
    setCallActive(true);
    callActiveRef.current = true;
    setIsMicMuted(false);
    isMicMutedRef.current = false;
    setMicPermissionError(null);

    // Warm up speech synthesis audio context for mobile iOS Safari / Android gesture requirements
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
      } catch {}
    }

    // Request microphone permission upfront
    await requestMicrophoneAccess();

    // Initial greeting from Aria
    const initialGreeting =
      "Hello! This is Aria from VoxHire.AI calling regarding your application for the Software Developer opening. Thanks for taking my call today! How are you doing?";

    const firstTurn: ConversationTurn = {
      id: `turn-init-${Date.now()}`,
      speaker: 'ai',
      text: initialGreeting,
      time: '00:01',
    };

    setTurns([firstTurn]);
    setVoiceStatus('ai_speaking');
    isAiSpeakingRef.current = true;

    // Start speech recognition
    let recognizer = recognitionRef.current;
    if (!recognizer) {
      recognizer = initSpeechRecognition();
      recognitionRef.current = recognizer;
    }

    if (recognizer) {
      try {
        recognizer.start();
      } catch (err) {
        // Already started
      }
    }

    // Speak initial greeting aloud
    speakNaturalConversational(initialGreeting, 'en', {
      onStart: () => {
        if (!callActiveRef.current) {
          stopNaturalSpeech();
          return;
        }
        isAiSpeakingRef.current = true;
        setVoiceStatus('ai_speaking');
      },
      onEnd: () => {
        isAiSpeakingRef.current = false;
        if (callActiveRef.current) {
          setVoiceStatus('listening');
        }
      },
      onError: () => {
        isAiSpeakingRef.current = false;
        if (callActiveRef.current) {
          setVoiceStatus('listening');
        }
      },
    });
  }, [initSpeechRecognition, requestMicrophoneAccess]);

  // End Call
  const endCall = useCallback(() => {
    stopNaturalSpeech();
    isAiSpeakingRef.current = false;
    setCallActive(false);
    callActiveRef.current = false;
    setVoiceStatus('idle');
    setInterimTranscript('');
    pendingUserSpeechRef.current = '';

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  }, []);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    setIsMicMuted((prev) => {
      const next = !prev;
      isMicMutedRef.current = next;
      if (next) {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch {}
        }
      } else {
        if (recognitionRef.current && callActiveRef.current) {
          try {
            recognitionRef.current.start();
          } catch {}
        }
      }
      return next;
    });
  }, []);

  // Send Text Response (Fallback / Prompting)
  const sendTextTurn = useCallback(
    (text: string) => {
      if (!callActiveRef.current || !text.trim()) return;
      interruptAiSpeech();
      processUserMessage(text.trim());
    },
    [interruptAiSpeech, processUserMessage]
  );

  return {
    callActive,
    voiceStatus,
    seconds,
    turns,
    interimTranscript,
    isMicMuted,
    micSupported,
    micPermissionGranted,
    micPermissionError,
    audioLevel,
    formatTimer,
    startCall,
    endCall,
    toggleMute,
    sendTextTurn,
    interruptAiSpeech,
    requestMicrophoneAccess,
  };
}
