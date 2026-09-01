import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles, Globe, Radio, Languages, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { INDIAN_LANGUAGES, getVernacularAdvisory } from '../utils/vernacularTranslator';

export default function AudioAdvisoryPlayer({
  title = 'Crop Health Advisory',
  summaryText = '',
  advisorySteps = [],
  diseaseData = null,
  className = '',
}) {
  const { lang, setLang } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [selectedVoiceLang, setSelectedVoiceLang] = useState(lang || 'en');
  const [voicesAvailable, setVoicesAvailable] = useState([]);
  const [showTranscript, setShowTranscript] = useState(true);
  const utteranceRef = useRef(null);

  // Sync selected voice language when context language changes
  useEffect(() => {
    if (lang) {
      setSelectedVoiceLang(lang);
    }
  }, [lang]);

  // Load available speech synthesis voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setVoicesAvailable(voices);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Compute translated vernacular advisory object
  const currentAdvisory = getVernacularAdvisory(
    selectedVoiceLang,
    diseaseData || {
      condition: title.replace('Diagnosis: ', '').replace('Outbreak Advisory: ', ''),
      crop: 'Crop',
      confidence: 94,
      riskLevel: 'High',
    },
    advisorySteps
  );

  const getFullTextToSpeak = () => {
    let text = `${currentAdvisory.greeting} ${currentAdvisory.diagnosisText} ${currentAdvisory.practicalSummary} `;
    if (currentAdvisory.spokenSteps && currentAdvisory.spokenSteps.length > 0) {
      currentAdvisory.spokenSteps.forEach((step, idx) => {
        text += `${idx + 1}: ${step} `;
      });
    }
    text += currentAdvisory.conclusion;
    return text;
  };

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech voice narration is not supported in this browser.');
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const textToSpeak = getFullTextToSpeak();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    const langConfig = INDIAN_LANGUAGES.find((l) => l.code === selectedVoiceLang);
    const targetCode = langConfig ? langConfig.voiceCode : 'en-IN';
    utterance.lang = targetCode;

    // Find best available native Indian voice
    const matchedVoice = voicesAvailable.find(
      (v) =>
        v.lang.toLowerCase().includes(targetCode.toLowerCase()) ||
        v.lang.toLowerCase().startsWith(selectedVoiceLang.toLowerCase())
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis cancelled or encountered an event:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const handleLangChange = (newLang) => {
    handleStop();
    setSelectedVoiceLang(newLang);
    if (setLang) {
      setLang(newLang);
    }
  };

  const handleRateChange = (newRate) => {
    setSpeechRate(newRate);
    if (isPlaying) {
      handleStop();
      setTimeout(handlePlay, 150);
    }
  };

  return (
    <div className={`audio-advisory-player ${className}`}>
      {/* HEADER ROW */}
      <div className="audio-player-header">
        <div className="audio-title-group">
          <div className="audio-pulse-indicator">
            <Radio size={16} className={isPlaying ? 'icon-pulse-active' : 'icon-muted'} />
            <span className="audio-badge-lbl">
              {isPlaying ? 'Speaking Vernacular Kisan Voice...' : 'Vernacular Voice Advisory (Kisan Audio)'}
            </span>
          </div>
          <p className="audio-help-text">
            Listen to instant spoken agricultural advisory in your preferred Indian language
          </p>
        </div>

        {/* NATIVE INDIAN LANGUAGE SELECTOR */}
        <div className="audio-lang-picker">
          <Languages size={15} className="icon-green" />
          <select
            value={selectedVoiceLang}
            onChange={(e) => handleLangChange(e.target.value)}
            className="audio-lang-select"
            aria-label="Select Spoken Voice Language"
          >
            {INDIAN_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CONTROLS ROW */}
      <div className="audio-player-controls-row">
        <div className="audio-main-buttons">
          {!isPlaying ? (
            <button
              type="button"
              className="audio-btn-play"
              onClick={handlePlay}
              aria-label="Play Spoken Advisory"
            >
              <Volume2 size={16} />
              <span>{isPaused ? 'Resume Voice' : 'Play Voice Advisory'}</span>
            </button>
          ) : (
            <button
              type="button"
              className="audio-btn-pause"
              onClick={handlePause}
              aria-label="Pause Spoken Advisory"
            >
              <Pause size={16} />
              <span>Pause</span>
            </button>
          )}

          <button
            type="button"
            className="audio-btn-stop"
            onClick={handleStop}
            title="Reset Audio"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>

        {/* ANIMATED WAVEFORM BARS */}
        <div className="audio-waveform-container" aria-hidden="true">
          <div className={`waveform-bar ${isPlaying ? 'wave-anim-1' : ''}`}></div>
          <div className={`waveform-bar ${isPlaying ? 'wave-anim-2' : ''}`}></div>
          <div className={`waveform-bar ${isPlaying ? 'wave-anim-3' : ''}`}></div>
          <div className={`waveform-bar ${isPlaying ? 'wave-anim-4' : ''}`}></div>
          <div className={`waveform-bar ${isPlaying ? 'wave-anim-5' : ''}`}></div>
        </div>

        {/* SPEED CHIPS */}
        <div className="audio-speed-chips">
          <span className="speed-lbl">Speed:</span>
          {[0.8, 1.0, 1.2].map((rate) => (
            <button
              key={rate}
              type="button"
              className={`speed-chip ${speechRate === rate ? 'speed-chip-active' : ''}`}
              onClick={() => handleRateChange(rate)}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* SPOKEN VERNACULAR TRANSCRIPT BOX */}
      {showTranscript && (
        <div className="spoken-transcript-box mt-12">
          <div className="transcript-header-line">
            <Sparkles size={13} className="icon-gold" />
            <strong>Spoken Vernacular Script ({INDIAN_LANGUAGES.find((l) => l.code === selectedVoiceLang)?.name}):</strong>
          </div>
          <p className="transcript-greeting">{currentAdvisory.greeting}</p>
          <p className="transcript-main">{currentAdvisory.diagnosisText}</p>
          <p className="transcript-summary">{currentAdvisory.practicalSummary}</p>
          <div className="transcript-steps-list">
            {currentAdvisory.spokenSteps.map((step, idx) => (
              <div key={idx} className="transcript-step-item">
                <span className="step-badge-num">{idx + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
          <p className="transcript-conclusion">{currentAdvisory.conclusion}</p>
        </div>
      )}
    </div>
  );
}
