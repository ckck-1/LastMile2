import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Radio, Sparkles, AlertCircle, Play, Pause, RefreshCw } from "lucide-react";
import { generateGeminiSpeech } from "../services/api";

interface RadioDisseminationProps {
  alertText: string;
  alertTitle: string;
  locationName: string;
}

export const RadioDissemination: React.FC<RadioDisseminationProps> = ({
  alertText,
  alertTitle,
  locationName,
}) => {
  const [isPlayingNative, setIsPlayingNative] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [swahiliVoice, setSwahiliVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [englishVoice, setEnglishVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"sw" | "en">("sw");

  // Gemini TTS states
  const [isGeneratingGeminiTts, setIsGeneratingGeminiTts] = useState(false);
  const [geminiAudioUrl, setGeminiAudioUrl] = useState<string | null>(null);
  const [isPlayingGeminiAudio, setIsPlayingGeminiAudio] = useState(false);
  const [geminiTtsError, setGeminiTtsError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load Web Speech API Voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);

      const sw = voices.find(
        (v) => v.lang.startsWith("sw") || v.lang.includes("sw_KE") || v.lang.includes("sw_TZ")
      );
      const en = voices.find(
        (v) => v.lang.startsWith("en") || v.lang.includes("en_US") || v.lang.includes("en_GB")
      );

      setSwahiliVoice(sw || null);
      setEnglishVoice(en || null);
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Web Speech API Playback
  const handleToggleNativeSpeech = () => {
    if (!("speechSynthesis" in window)) {
      alert("Browser SpeechSynthesis is not supported in this environment.");
      return;
    }

    if (isPlayingNative) {
      window.speechSynthesis.cancel();
      setIsPlayingNative(false);
      return;
    }

    const fullScript = `Community Radio Early Warning Bulletin for ${locationName}. ${alertTitle}. ${alertText}`;
    const utterance = new SpeechSynthesisUtterance(fullScript);

    if (selectedLanguage === "sw") {
      utterance.lang = "sw-KE";
      if (swahiliVoice) utterance.voice = swahiliVoice;
    } else {
      utterance.lang = "en-US";
      if (englishVoice) utterance.voice = englishVoice;
    }

    utterance.rate = 0.95; // slightly slower for radio clarity
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingNative(false);
    utterance.onerror = () => setIsPlayingNative(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingNative(true);
  };

  // Gemini TTS Generation
  const handleGenerateGeminiAudio = async () => {
    setIsGeneratingGeminiTts(true);
    setGeminiTtsError(null);
    try {
      const script = `Community Radio Early Warning Bulletin for ${locationName}. ${alertTitle}. ${alertText}`;
      const res = await generateGeminiSpeech(script, "Kore");
      if (res.audioUrl) {
        setGeminiAudioUrl(res.audioUrl);
      } else if (res.fallbackToSpeechSynth) {
        setGeminiTtsError("Gemini Cloud TTS API is currently experiencing peak demand spike. Automatically initiating local offline broadcast voice engine...");
        handleToggleNativeSpeech();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setGeminiTtsError(`Gemini TTS API error: ${msg}. Switching to Option 1 Local Engine...`);
      handleToggleNativeSpeech();
    } finally {
      setIsGeneratingGeminiTts(false);
    }
  };

  const handleToggleGeminiAudio = () => {
    if (!audioRef.current || !geminiAudioUrl) return;

    if (isPlayingGeminiAudio) {
      audioRef.current.pause();
      setIsPlayingGeminiAudio(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingGeminiAudio(true);
        })
        .catch((err) => {
          console.error("Audio playback error:", err);
          setIsPlayingGeminiAudio(false);
          setGeminiTtsError(`Audio playback error: ${err instanceof Error ? err.message : String(err)}`);
        });
    }
  };

  return (
    <div className="tech-panel mb-6">
      <div className="tech-pane-title flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-[#D94A38]" />
          <span>Community Radio Dissemination Engine</span>
        </div>
        <span className="bg-[#2E7D32] text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 font-technical-mono">
          Ready
        </span>
      </div>

      {/* Script Preview Box */}
      <div className="p-4 border-b border-[#141414] bg-[#E4E3E0] font-technical-mono text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-[#D94A38] uppercase text-[10px]">
            Radio Broadcast Script Preview:
          </span>
          <span className="text-[10px] text-[#141414]/70">{locationName} FM Hub</span>
        </div>
        <p className="text-xs text-[#141414] leading-relaxed font-technical-serif italic bg-white border border-[#141414] p-3">
          &ldquo;Community Radio Early Warning Bulletin for {locationName}. {alertTitle}. {alertText}&rdquo;
        </p>
      </div>

      {/* Speech Audio Tools */}
      <div className="p-4 sm:p-5 space-y-4 font-technical-mono text-xs">
        {/* Web Speech API */}
        <div className="p-4 bg-white border border-[#141414]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h4 className="font-bold text-[#141414] flex items-center space-x-2 text-xs">
                <Volume2 className="w-4 h-4 text-[#D94A38]" />
                <span>1. Local SpeechSynthesis (Web Audio API)</span>
              </h4>
              <p className="text-[11px] text-[#141414]/70 mt-0.5">
                Instant speech generation using browser audio synthesizer
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as "sw" | "en")}
                className="bg-[#E4E3E0] border border-[#141414] text-[#141414] text-xs px-2 py-1 font-technical-mono"
              >
                <option value="sw">Kiswahili Voice</option>
                <option value="en">English Voice</option>
              </select>

              <button
                onClick={handleToggleNativeSpeech}
                className={`tech-btn flex items-center space-x-1 ${
                  isPlayingNative ? "bg-[#D94A38] text-white" : ""
                }`}
              >
                {isPlayingNative ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Play Audio</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {selectedLanguage === "sw" && !swahiliVoice && (
            <div className="p-2.5 bg-[#FFEBEE] border border-[#D94A38] text-[11px] text-[#141414] flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-[#D94A38] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Swahili Voice Notice: </span>
                Your browser uses fallback synthesis for Kiswahili. Use Gemini Cloud Audio below for studio-quality voice.
              </div>
            </div>
          )}
        </div>

        {/* Gemini TTS */}
        <div className="p-4 bg-white border border-[#141414]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h4 className="font-bold text-[#141414] flex items-center space-x-2 text-xs">
                <Sparkles className="w-4 h-4 text-[#D94A38]" />
                <span>2. Gemini Cloud Audio Stream (Multi-Model Failover: gemini-2.0-flash-exp / gemini-3.1-flash-tts-preview)</span>
              </h4>
              <p className="text-[11px] text-[#141414]/70 mt-0.5">
                Generates high-fidelity radio broadcast voice audio via Gemini API
              </p>
            </div>

            <button
              onClick={handleGenerateGeminiAudio}
              disabled={isGeneratingGeminiTts}
              className="tech-btn-accent flex items-center space-x-1"
            >
              {isGeneratingGeminiTts ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synthesize Studio Audio</span>
                </>
              )}
            </button>
          </div>

          {geminiTtsError && (
            <div className="p-3 bg-[#FFEBEE] border border-[#D94A38] text-xs text-[#141414] mb-3">
              {geminiTtsError}
            </div>
          )}

          {geminiAudioUrl && (
            <div className="p-3 bg-[#E4E3E0] border border-[#141414] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleToggleGeminiAudio}
                  className="p-2 bg-[#D94A38] text-white border border-[#141414] transition-all"
                >
                  {isPlayingGeminiAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <div>
                  <p className="text-xs font-bold text-[#141414]">Radio Broadcast Audio Ready</p>
                  <p className="text-[10px] text-[#141414]/70">24kHz PCM Audio Stream</p>
                </div>
              </div>

              <audio
                ref={audioRef}
                src={geminiAudioUrl}
                onEnded={() => setIsPlayingGeminiAudio(false)}
                onError={(e) => {
                  console.error("Audio element error:", e);
                  setIsPlayingGeminiAudio(false);
                  setGeminiTtsError("Audio playback error: Format unsupported or browser media decoder error.");
                }}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
