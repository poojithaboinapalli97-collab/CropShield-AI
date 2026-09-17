/**
 * CropShield AI - Kisan Voice AI Assistant Component
 * Precision Agri-Vision (Smart Agriculture & Crop Health)
 * 
 * Implements the 5-Stage Voice Intelligence Pipeline:
 * 🎤 Farmer Speaks → Speech → Text → CropShield AI → Simple Answer → 🔊 Voice Response
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Bot,
  Send,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Languages,
  Clock,
  FlaskConical,
  X,
} from 'lucide-react';
import { INDIAN_LANGUAGES } from '../utils/vernacularTranslator.js';
import { processFarmerVoiceQuery, SAMPLE_VOICE_QUERIES } from '../services/kisanVoiceEngine.js';
import '../styles/KisanVoiceAssistant.css';

export default function KisanVoiceAssistant({
  isOpen = true,
  onClose = () => {},
  currentCrop = 'Tomato',
  weather = null,
  embeddedMode = false,
}) {
  const [selectedLang, setSelectedLang] = useState('te'); // Default Telugu
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [activeStep, setActiveStep] = useState(1); // 1 to 5
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Audio Playback states
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [voicesAvailable, setVoicesAvailable] = useState([]);

  // Recognition ref
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition & Synthesis
  useEffect(() => {
    // 1. Voice Synthesis list
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const v = window.speechSynthesis.getVoices();
        setVoicesAvailable(v);
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // 2. Speech Recognition Setup
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;

        const langCfg = INDIAN_LANGUAGES.find((l) => l.code === selectedLang);
        recog.lang = langCfg ? langCfg.voiceCode : 'en-IN';

        recog.onstart = () => {
          setIsListening(true);
          setActiveStep(1);
        };

        recog.onresult = (event) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          setActiveStep(2);
        };

        recog.onerror = (event) => {
          console.warn('Speech recognition event:', event.error);
          setIsListening(false);
        };

        recog.onend = () => {
          setIsListening(false);
          // If transcript captured, automatically advance to CropShield AI
          setTranscript((prev) => {
            if (prev.trim()) {
              triggerAiProcessing(prev.trim(), selectedLang);
            }
            return prev;
          });
        };

        recognitionRef.current = recog;
      }
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (err) {}
      }
    };
  }, [selectedLang]);

  // Handle Speech Toggle
  const toggleListening = () => {
    if (isPlayingAudio) {
      stopVoiceResponse();
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not natively supported in this browser. Please type your question or select a sample query below.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setTranscript('');
      setAiResult(null);
      setActiveStep(1);

      try {
        if (recognitionRef.current) {
          const langCfg = INDIAN_LANGUAGES.find((l) => l.code === selectedLang);
          recognitionRef.current.lang = langCfg ? langCfg.voiceCode : 'en-IN';
          recognitionRef.current.start();
        }
      } catch (err) {
        console.warn('Speech recog start error:', err);
      }
    }
  };

  // Submit Farmer Query to CropShield AI
  const triggerAiProcessing = (queryText, lang) => {
    if (!queryText.trim()) return;
    setActiveStep(3);
    setIsAiProcessing(true);

    setTimeout(() => {
      const response = processFarmerVoiceQuery({
        query: queryText,
        langCode: lang || selectedLang,
        crop: currentCrop,
        weather: weather,
      });

      setAiResult(response);
      setIsAiProcessing(false);
      setActiveStep(4);

      // Auto trigger voice response
      speakVoiceResponse(response.spokenVoiceText, lang || selectedLang);
    }, 750);
  };

  // Speak Voice Response (Stage 5)
  const speakVoiceResponse = (textToSpeak, lang) => {
    if (!('speechSynthesis' in window) || !textToSpeak) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speechRate;

    const langCfg = INDIAN_LANGUAGES.find((l) => l.code === (lang || selectedLang));
    const targetCode = langCfg ? langCfg.voiceCode : 'en-IN';
    utterance.lang = targetCode;

    // Best matching native Indian accent voice
    const matchedVoice = voicesAvailable.find(
      (v) =>
        v.lang.toLowerCase() === targetCode.toLowerCase() ||
        v.lang.toLowerCase().startsWith((lang || selectedLang).toLowerCase())
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setIsAudioPaused(false);
      setActiveStep(5);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const pauseVoiceResponse = () => {
    if ('speechSynthesis' in window && isPlayingAudio) {
      window.speechSynthesis.pause();
      setIsAudioPaused(true);
    }
  };

  const resumeVoiceResponse = () => {
    if ('speechSynthesis' in window && isAudioPaused) {
      window.speechSynthesis.resume();
      setIsAudioPaused(false);
    }
  };

  const stopVoiceResponse = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
    }
  };

  const handleSampleClick = (sample) => {
    setSelectedLang(sample.lang);
    setTranscript(sample.query);
    triggerAiProcessing(sample.query, sample.lang);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    triggerAiProcessing(transcript, selectedLang);
  };

  if (!isOpen) return null;

  const content = (
    <div className={`kisan-voice-modal-container ${embeddedMode ? 'embedded-mode' : ''}`}>
      {/* HEADER */}
      <div className="kv-modal-header">
        <div className="kv-title-group">
          <div className="kv-logo-badge">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <div className="kv-title-row">
              <h3 className="kv-title">Kisan Voice AI Assistant</h3>
              <span className="kv-badge-live">Speech ↔ Speech</span>
            </div>
            <p className="kv-subtitle">
              Speak in your mother tongue for instant, voice-narrated crop advisory.
            </p>
          </div>
        </div>

        {!embeddedMode && (
          <button type="button" className="kv-close-btn" onClick={onClose} aria-label="Close Assistant">
            <X size={18} />
          </button>
        )}
      </div>

      {/* 5-STAGE PIPELINE PROGRESS TRACKER */}
      <div className="kv-pipeline-tracker">
        <div className={`kv-pipe-step ${activeStep >= 1 ? 'step-done' : ''} ${activeStep === 1 ? 'step-active' : ''}`}>
          <div className="kv-pipe-node">🎤</div>
          <span className="kv-pipe-label">1. Farmer Speaks</span>
        </div>
        <div className="kv-pipe-connector"></div>

        <div className={`kv-pipe-step ${activeStep >= 2 ? 'step-done' : ''} ${activeStep === 2 ? 'step-active' : ''}`}>
          <div className="kv-pipe-node">✍️</div>
          <span className="kv-pipe-label">2. Speech → Text</span>
        </div>
        <div className="kv-pipe-connector"></div>

        <div className={`kv-pipe-step ${activeStep >= 3 ? 'step-done' : ''} ${activeStep === 3 ? 'step-active' : ''}`}>
          <div className="kv-pipe-node">🤖</div>
          <span className="kv-pipe-label">3. CropShield AI</span>
        </div>
        <div className="kv-pipe-connector"></div>

        <div className={`kv-pipe-step ${activeStep >= 4 ? 'step-done' : ''} ${activeStep === 4 ? 'step-active' : ''}`}>
          <div className="kv-pipe-node">💡</div>
          <span className="kv-pipe-label">4. Simple Answer</span>
        </div>
        <div className="kv-pipe-connector"></div>

        <div className={`kv-pipe-step ${activeStep >= 5 ? 'step-done' : ''} ${activeStep === 5 ? 'step-active' : ''}`}>
          <div className="kv-pipe-node">🔊</div>
          <span className="kv-pipe-label">5. Voice Response</span>
        </div>
      </div>

      {/* STAGE 1 & 2: INTERACTIVE MICROPHONE & INPUT CONTROLS */}
      <div className="kv-mic-interaction-card">
        <div className="kv-lang-selector-row">
          <label className="kv-lang-label">
            <Languages size={15} />
            <span>Speaking Language:</span>
          </label>
          <select
            className="kv-lang-dropdown"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
          >
            {INDIAN_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* MICROPHONE BUTTON & WAVE ANIMATION */}
        <div className="kv-mic-center-wrapper">
          <button
            type="button"
            className={`kv-mic-master-btn ${isListening ? 'listening-pulse' : ''}`}
            onClick={toggleListening}
            title={isListening ? 'Stop Listening' : 'Click to Speak'}
          >
            {isListening ? <Mic size={32} className="mic-icon-active" /> : <Mic size={32} className="mic-icon-idle" />}
          </button>

          <div className="kv-mic-status-text">
            {isListening ? (
              <span className="text-listening">
                🔴 Listening to your voice... Speak now in{' '}
                <strong>{INDIAN_LANGUAGES.find((l) => l.code === selectedLang)?.name}</strong>
              </span>
            ) : (
              <span className="text-tap-speak">Tap microphone to speak your question</span>
            )}
          </div>

          {/* AUDIO WAVE VISUALIZER BARS (WHEN LISTENING OR SPEAKING) */}
          {(isListening || isPlayingAudio) && (
            <div className="kv-sound-wave">
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
            </div>
          )}
        </div>

        {/* STAGE 2: LIVE TRANSCRIPTION & MANUAL EDIT */}
        <form onSubmit={handleManualSubmit} className="kv-transcription-box">
          <div className="kv-transcript-header">
            <span className="kv-th-title">
              {isListening ? 'Live Speech Recognition:' : 'Farmer Question Transcript:'}
            </span>
            {transcript && (
              <button
                type="button"
                className="kv-clear-btn"
                onClick={() => setTranscript('')}
              >
                Clear
              </button>
            )}
          </div>
          <div className="kv-input-row">
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="e.g. టమాట ఆకుమచ్చ తెగులుకు ఏ మందు కొట్టాలి? / What to spray for blight?"
              className="kv-transcript-input"
            />
            <button
              type="submit"
              disabled={!transcript.trim() || isAiProcessing}
              className="kv-ask-submit-btn"
            >
              {isAiProcessing ? <Sparkles size={16} className="spin-icon" /> : <Send size={16} />}
              <span>{isAiProcessing ? 'Analyzing...' : 'Ask AI'}</span>
            </button>
          </div>
        </form>

        {/* SAMPLE VOICE PROMPTS */}
        <div className="kv-sample-prompts-section">
          <span className="kv-sample-title">💡 Quick Voice Questions:</span>
          <div className="kv-sample-chips-grid">
            {SAMPLE_VOICE_QUERIES.filter((s) => s.lang === selectedLang || s.lang === 'en').slice(0, 4).map((s, idx) => (
              <button
                key={idx}
                type="button"
                className="kv-sample-chip"
                onClick={() => handleSampleClick(s)}
              >
                <span className="chip-cat">{s.category}:</span>
                <span className="chip-text">"{s.query}"</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STAGE 3, 4 & 5: AI ANSWER & VOICE RESPONSE CARD */}
      {aiResult && (
        <div className="kv-answer-response-card">
          <div className="kv-answer-top-bar">
            <div className="kv-answer-badge">
              <Sparkles size={16} className="text-green" />
              <span>4. Simple Farmer Guidance</span>
            </div>

            <div className="kv-voice-controls-bar">
              <span className="kv-voice-label">5. 🔊 Voice Response:</span>
              {!isPlayingAudio ? (
                <button
                  type="button"
                  className="kv-audio-btn kv-audio-play"
                  onClick={() => speakVoiceResponse(aiResult.spokenVoiceText, selectedLang)}
                >
                  <Volume2 size={15} />
                  <span>Listen Voice</span>
                </button>
              ) : isAudioPaused ? (
                <button
                  type="button"
                  className="kv-audio-btn kv-audio-resume"
                  onClick={resumeVoiceResponse}
                >
                  <Play size={15} />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="kv-audio-btn kv-audio-pause"
                  onClick={pauseVoiceResponse}
                >
                  <Pause size={15} />
                  <span>Pause</span>
                </button>
              )}

              {isPlayingAudio && (
                <button
                  type="button"
                  className="kv-audio-btn kv-audio-stop"
                  onClick={stopVoiceResponse}
                  title="Stop Audio"
                >
                  <VolumeX size={15} />
                </button>
              )}

              {/* Speed toggle */}
              <div className="kv-speed-selector">
                {[0.8, 1.0, 1.2].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    className={`kv-speed-btn ${speechRate === spd ? 'kv-speed-active' : ''}`}
                    onClick={() => {
                      setSpeechRate(spd);
                      if (isPlayingAudio) {
                        speakVoiceResponse(aiResult.spokenVoiceText, selectedLang);
                      }
                    }}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          <h4 className="kv-answer-heading">{aiResult.title}</h4>
          <p className="kv-answer-summary">{aiResult.summary}</p>

          {/* ACTION STEPS */}
          <div className="kv-action-steps-list">
            {aiResult.keyActions.map((step, idx) => (
              <div key={idx} className="kv-action-step-item">
                <CheckCircle2 size={16} className="icon-step-check" />
                <span>{step}</span>
              </div>
            ))}
          </div>

          {/* DOSAGE & TIMING PILLS */}
          <div className="kv-pills-row">
            <div className="kv-info-pill">
              <FlaskConical size={14} className="icon-pill" />
              <div>
                <strong>Dosage: </strong>
                <span>{aiResult.dosage}</span>
              </div>
            </div>

            <div className="kv-info-pill">
              <Clock size={14} className="icon-pill" />
              <div>
                <strong>Timing: </strong>
                <span>{aiResult.timing}</span>
              </div>
            </div>
          </div>

          {/* SPOKEN SCRIPT PREVIEW */}
          <div className="kv-spoken-script-preview">
            <span className="kv-script-label">🔊 Spoken Vernacular Script:</span>
            <p className="kv-script-text">"{aiResult.spokenVoiceText}"</p>
          </div>
        </div>
      )}
    </div>
  );

  if (embeddedMode) {
    return content;
  }

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-content-card kv-modal-card-wrapper" onClick={(e) => e.stopPropagation()}>
        {content}
      </div>
    </div>
  );
}
