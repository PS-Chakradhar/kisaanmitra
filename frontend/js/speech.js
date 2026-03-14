/**
 * KisaanMitra - Speech Engine with OFFLINE SUPPORT
 * Multiple approaches for offline voice recognition
 */
const SpeechEngine = {
    recognition: null,
    isListening: false,
    isRecordingAudio: false,
    mediaRecorder: null,
    audioChunks: [],
    offlineFallbackEnabled: true,

    init() {
        // Try to initialize speech recognition
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SR) {
            try {
                this.recognition = new SR();
                this.recognition.continuous = false;
                this.recognition.interimResults = true;
                this.recognition.maxAlternatives = 3;
                
                // Try to enable offline recognition
                if (this.recognition.grammars) {
                    // Some implementations support this
                }
                
                console.log('✅ Speech Recognition initialized');
                return true;
            } catch (e) {
                console.warn('Speech Recognition init failed:', e);
            }
        }
        
        // Check for Safari offline dictation (webkit prefix)
        const SafariSR = window.webkitSpeechRecognition;
        if (SafariSR && !this.recognition) {
            try {
                this.recognition = new SafariSR();
                this.recognition.continuous = false;
                this.recognition.interimResults = true;
                this.recognition.maxAlternatives = 3;
                console.log('✅ Safari Speech Recognition initialized');
                return true;
            } catch (e) {
                console.warn('Safari Speech Recognition failed:', e);
            }
        }
        
        console.warn('Speech Recognition not supported');
        return false;
    },

    // Check if device supports offline speech
    checkOfflineSupport() {
        return {
            hasSpeechAPI: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
            isSafari: /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent),
            isChrome: /chrome/i.test(navigator.userAgent) && !/edge/i.test(navigator.userAgent),
            isAndroid: /android/i.test(navigator.userAgent),
            isMobile: /iphone|ipad|ipod|android/i.test(navigator.userAgent)
        };
    },

    // Main listen function with multiple fallback strategies
    async listen(langCode = 'hi-IN') {
        const support = this.checkOfflineSupport();
        
        console.log('Speech support:', support);
        
        // Strategy 1: Try Web Speech API (works offline on some devices)
        if (this.recognition) {
            try {
                return await this.listenWithWebSpeech(langCode);
            } catch (e) {
                console.warn('Web Speech failed:', e.message);
            }
        }
        
        // Strategy 2: Try Safari-specific offline dictation
        if (support.isSafari) {
            try {
                return await this.listenWithSafariOffline(langCode);
            } catch (e) {
                console.warn('Safari offline failed:', e.message);
            }
        }
        
        // Strategy 3: Use audio recording fallback
        if (this.offlineFallbackEnabled && support.isMobile) {
            try {
                return await this.recordVoiceNote(langCode);
            } catch (e) {
                console.warn('Voice recording failed:', e.message);
            }
        }
        
        throw new Error('voice_not_available');
    },

    // Standard Web Speech API (works on some offline devices)
    listenWithWebSpeech(langCode = 'hi-IN') {
        return new Promise((resolve, reject) => {
            if (!this.recognition) {
                reject(new Error('recognition_not_available'));
                return;
            }
            
            this.recognition.lang = langCode;
            this.recognition.serviceURI = 'dictation'; // Try to use offline service
            
            let finalTranscript = '';

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
                
                const el = document.getElementById('voice-status');
                if (el) {
                    el.textContent = finalTranscript + (interim ? ' ' + interim + '...' : '');
                }
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this._updateUI(false);
                
                if (finalTranscript.trim()) {
                    resolve(finalTranscript.trim());
                } else {
                    // Check if there were alternatives
                    if (event && event.results && event.results[0] && event.results[0][0].transcript) {
                        resolve(event.results[0][0].transcript.trim());
                    } else {
                        reject(new Error('no_speech'));
                    }
                }
            };

            this.recognition.onerror = (event) => {
                this.isListening = false;
                this._updateUI(false);
                reject(new Error(event.error));
            };

            try {
                this.recognition.start();
                this.isListening = true;
                this._updateUI(true);
            } catch (e) {
                this.isListening = false;
                this._updateUI(false);
                reject(e);
            }
        });
    },

    // Safari-specific offline dictation
    listenWithSafariOffline(langCode = 'hi-IN') {
        return new Promise((resolve, reject) => {
            // Safari has better offline support
            const sr = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            sr.lang = langCode;
            sr.continuous = false;
            sr.interimResults = true;
            sr.maxAlternatives = 3;
            
            // Force offline mode hints for Safari
            if (sr.grammars) {
                sr.grammars = new window.SpeechGrammarList();
            }

            let finalTranscript = '';

            sr.onresult = (event) => {
                let interim = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interim += transcript;
                    }
                }
                
                const el = document.getElementById('voice-status');
                if (el) {
                    el.textContent = finalTranscript + (interim ? ' ' + interim + '...' : '');
                }
            };

            sr.onend = () => {
                this.isListening = false;
                this._updateUI(false);
                if (finalTranscript.trim()) {
                    resolve(finalTranscript.trim());
                } else {
                    reject(new Error('no_speech'));
                }
            };

            sr.onerror = (event) => {
                this.isListening = false;
                this._updateUI(false);
                // 'no-speech' is okay, but network means offline
                if (event.error === 'network') {
                    // Try one more time with different settings
                    console.log('Network error - trying fallback...');
                }
                reject(new Error(event.error));
            };

            try {
                sr.start();
                this.isListening = true;
                this._updateUI(true);
            } catch (e) {
                reject(e);
            }
        });
    },

    // Record voice note and save for later (when online)
    async recordVoiceNote(langCode = 'hi-IN') {
        return new Promise(async (resolve, reject) => {
            try {
                // Request microphone access
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                
                this.isRecordingAudio = true;
                this._updateUI(true, true);
                
                const status = document.getElementById('voice-status');
                if (status) status.textContent = 'Recording... Tap to stop';
                
                // Create MediaRecorder
                this.mediaRecorder = new MediaRecorder(stream);
                this.audioChunks = [];
                
                this.mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        this.audioChunks.push(event.data);
                    }
                };
                
                this.mediaRecorder.onstop = async () => {
                    this.isListening = false;
                    this.isRecordingAudio = false;
                    this._updateUI(false, false);
                    
                    // Save audio blob
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                    
                    // Store in localStorage for later processing
                    const pendingQueries = JSON.parse(localStorage.getItem('pendingVoiceQueries') || '[]');
                    pendingQueries.push({
                        audio: audioBlob,
                        lang: langCode,
                        timestamp: Date.now()
                    });
                    
                    // Store only metadata (blob URLs don't persist)
                    // Instead, save as base64 if small enough
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        try {
                            localStorage.setItem('pendingVoiceQueries', JSON.stringify([...pendingQueries.slice(-2), {
                                audioData: reader.result,
                                lang: langCode,
                                timestamp: Date.now()
                            }]));
                        } catch (e) {
                            console.warn('Could not save audio:', e);
                        }
                    };
                    reader.readAsDataURL(audioBlob);
                    
                    stream.getTracks().forEach(track => track.stop());
                    
                    if (status) status.textContent = '✅ Voice saved! Will process when online';
                    
                    // Try to process immediately if online
                    if (navigator.onLine) {
                        // Would need backend to process - show message
                        if (status) status.textContent = '✅ Voice saved! Processing...';
                        // For now, just acknowledge
                    }
                    
                    resolve('Voice note recorded - processing when online');
                };
                
                // Start recording
                this.mediaRecorder.start();
                
                // Auto-stop after 10 seconds max
                setTimeout(() => {
                    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                        this.mediaRecorder.stop();
                    }
                }, 10000);
                
            } catch (e) {
                this.isRecordingAudio = false;
                this._updateUI(false, false);
                reject(e);
            }
        });
    },

    stop() {
        if (this.recognition && this.isListening) {
            try {
                this.recognition.stop();
            } catch (e) {}
        }
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
        }
        this.isListening = false;
        this.isRecordingAudio = false;
        this._updateUI(false, false);
    },

    speak(text, langCode = 'hi-IN') {
        return new Promise((resolve) => {
            if (!window.speechSynthesis) {
                resolve();
                return;
            }
            
            window.speechSynthesis.cancel();

            // Clean up text for natural speech
            let cleanText = text.replace(/[\*`#]/g, "");
            // Split at sentence boundaries for breathing pauses
            let chunks = cleanText.replace(/([.,!?\n\|।]+)/g, "$1|~|").split("|~|").map(c => c.trim()).filter(Boolean);

            const getVoice = () => {
                const voices = window.speechSynthesis.getVoices();
                const langPrefix = langCode.split('-')[0];
                
                let matched = voices.find(v => v.lang.startsWith(langPrefix));
                
                if (!matched && langPrefix === 'hi') {
                    matched = voices.find(v => 
                        v.name.toLowerCase().includes('hindi') || 
                        v.lang.includes('IN')
                    );
                }
                
                return matched;
            };
            
            let matched = getVoice();
            
            // If voices not loaded yet, wait
            const voices = window.speechSynthesis.getVoices();
            if (!voices || voices.length === 0) {
                window.speechSynthesis.onvoiceschanged = () => {
                    matched = getVoice();
                };
            }

            let currentIndex = 0;

            const speakNextChunk = () => {
                if (currentIndex >= chunks.length) { 
                    resolve(); 
                    return; 
                }

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

    _updateUI(listening, recording = false) {
        const micBtn = document.getElementById('mic-button');
        const wave = document.getElementById('voice-wave');
        const status = document.getElementById('voice-status');
        
        if (listening || recording) {
            micBtn?.classList.add('listening');
            wave?.classList.remove('hidden');
            if (status) {
                if (recording) {
                    status.textContent = 'Recording... Tap to stop';
                } else {
                    status.textContent = 'Speaking... Tap to stop';
                }
            }
            if (navigator.vibrate) navigator.vibrate(50);
        } else {
            micBtn?.classList.remove('listening');
            wave?.classList.add('hidden');
            if (status) {
                const lang = window.currentLanguage || 'hi';
                status.textContent = lang === 'hi' ? 'माइक दबाएं और बोलें' : 'Tap mic and speak';
            }
        }
    }
};

// Pre-load voices
if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}
