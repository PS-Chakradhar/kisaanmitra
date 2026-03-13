/**
 * KisaanMitra - Speech Engine
 * Browser-native Web Speech API — completely FREE.
 * FIXES: Continuous listening with silence timeout, natural TTS pauses.
 */
const SpeechEngine = {
    recognition: null,
    isListening: false,
    _silenceTimer: null,
    _SILENCE_TIMEOUT: 3500, // 3.5 seconds of silence = auto-stop

    init() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { console.warn('Speech Recognition not supported'); return false; }
        this.recognition = new SR();
        this.recognition.continuous = true;       // FIXED: Keep listening
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
        return true;
    },

    listen(langCode = 'hi-IN') {
        return new Promise((resolve, reject) => {
            if (!this.recognition) { reject(new Error('Speech recognition not available')); return; }
            this.recognition.lang = langCode;
            let finalTranscript = '';

            // Reset silence timer on every speech event
            const resetSilenceTimer = () => {
                clearTimeout(this._silenceTimer);
                this._silenceTimer = setTimeout(() => {
                    // User has been silent for 3.5s — auto-stop
                    this.stop();
                }, this._SILENCE_TIMEOUT);
            };

            this.recognition.onresult = (event) => {
                let interim = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interim += transcript;
                    }
                }
                // Show live transcript to user
                const el = document.getElementById('voice-status');
                if (el) {
                    el.textContent = finalTranscript + (interim ? ' ' + interim + '...' : '');
                }
                resetSilenceTimer(); // User spoke — reset the silence countdown
            };

            this.recognition.onend = () => {
                clearTimeout(this._silenceTimer);
                this.isListening = false;
                this._updateUI(false);
                finalTranscript.trim() ? resolve(finalTranscript.trim()) : reject(new Error('no_speech'));
            };

            this.recognition.onerror = (event) => {
                clearTimeout(this._silenceTimer);
                this.isListening = false;
                this._updateUI(false);
                reject(new Error(event.error));
            };

            try {
                this.recognition.start();
                this.isListening = true;
                this._updateUI(true);
                resetSilenceTimer(); // Start the initial silence countdown
            } catch (e) { reject(e); }
        });
    },

    stop() {
        clearTimeout(this._silenceTimer);
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            this._updateUI(false);
        }
    },

    speak(text, langCode = 'hi-IN') {
        return new Promise((resolve) => {
            window.speechSynthesis.cancel();

            // Clean up text and split at punctuation for natural breathing pauses
            let cleanText = text.replace(/[\*`#]/g, "");
            let chunks = cleanText.replace(/([.,!?\n\|।]+)/g, "$1|~|").split("|~|").map(c => c.trim()).filter(Boolean);

            const voices = window.speechSynthesis.getVoices();
            const matched = voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
            let currentIndex = 0;

            const speakNextChunk = () => {
                if (currentIndex >= chunks.length) { resolve(); return; }

                const chunkText = chunks[currentIndex];
                const utterance = new SpeechSynthesisUtterance(chunkText);
                utterance.lang = langCode;
                utterance.rate = 0.85;
                utterance.pitch = 1;
                utterance.volume = 1;
                if (matched) utterance.voice = matched;

                utterance.onend = () => {
                    let delay = 250;
                    if (chunkText.endsWith(',') || chunkText.endsWith('،')) delay = 180;
                    if (chunkText.endsWith('.') || chunkText.endsWith('!') || chunkText.endsWith('?') || chunkText.endsWith('।')) delay = 450;
                    currentIndex++;
                    setTimeout(speakNextChunk, delay);
                };
                utterance.onerror = () => { currentIndex++; speakNextChunk(); };

                window.speechSynthesis.speak(utterance);
            };
            speakNextChunk();
        });
    },

    _updateUI(listening) {
        const micBtn = document.getElementById('mic-button');
        const wave = document.getElementById('voice-wave');
        const status = document.getElementById('voice-status');
        if (listening) {
            micBtn?.classList.add('listening');
            wave?.classList.remove('hidden');
            if (status) status.textContent = t('voice_listening');
            // Haptic feedback on mobile
            if (navigator.vibrate) navigator.vibrate(50);
        } else {
            micBtn?.classList.remove('listening');
            wave?.classList.add('hidden');
            if (status) status.textContent = t('voice_tap');
        }
    }
};

if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}
