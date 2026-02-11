/**
 * Advanced YouTube Music Player
 * Handles the YouTube IFrame API, playlist management, and UI controls.
 */

// Playlist Configuration
const PL_DATA = [
    {
        title: 'Awaken',
        artist: 'Valerie Broussard',
        id: 'qWzKLw6rpiQ',
        cover: 'https://img.youtube.com/vi/qWzKLw6rpiQ/maxresdefault.jpg'
    },
    {
        title: 'RISE',
        artist: 'The Glitch Mob, Mako',
        id: '_2uHC0FluU4',
        cover: 'https://img.youtube.com/vi/_2uHC0FluU4/maxresdefault.jpg'
    },
    {
        title: 'THE COMEBACK',
        artist: 'Geniuz',
        id: 'WiB5us3rPaA',
        cover: 'https://img.youtube.com/vi/WiB5us3rPaA/maxresdefault.jpg'
    },
    {
        title: 'Burn It All Down',
        artist: 'PVRIS',
        id: 'f6Qkwtq2BG4',
        cover: 'https://img.youtube.com/vi/f6Qkwtq2BG4/maxresdefault.jpg'
    },
    {
        title: 'GODS',
        artist: 'NewJeans',
        id: 'qA4FcLuL8Ts',
        cover: 'https://img.youtube.com/vi/qA4FcLuL8Ts/maxresdefault.jpg'
    }
];

class MusicPlayer {
    constructor() {
        this.player = null;
        this.currentIndex = 0;
        this.isShuffle = false;
        this.isRepeat = false;
        this.isPlaying = false;
        this.progressInterval = null;

        // Load state from local storage
        this.loadState();

        // Bind methods
        this.onPlayerReady = this.onPlayerReady.bind(this);
        this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
        this.tick = this.tick.bind(this);

        // Init
        this.initUI();
        this.initYouTube();
    }

    loadState() {
        try {
            const idx = parseInt(localStorage.getItem('kalebie_track_index'));
            this.currentIndex = (isNaN(idx) || idx < 0 || idx >= PL_DATA.length) ? 0 : idx;

            this.isShuffle = localStorage.getItem('kalebie_shuffle') === 'true';
            this.isRepeat = localStorage.getItem('kalebie_repeat') === 'true';
        } catch (e) {
            console.warn('Error loading state:', e);
            this.currentIndex = 0;
        }
    }

    saveState() {
        localStorage.setItem('kalebie_track_index', this.currentIndex);
        localStorage.setItem('kalebie_shuffle', this.isShuffle);
        localStorage.setItem('kalebie_repeat', this.isRepeat);
    }

    initUI() {
        // Initial render of song info
        this.updateSongInfo();
        this.renderPlaylist();

        // Control Buttons
        document.querySelector('.play-pause')?.addEventListener('click', () => this.togglePlay());
        document.querySelector('.prev-btn')?.addEventListener('click', () => this.prevTrack());
        document.querySelector('.next-btn')?.addEventListener('click', () => this.nextTrack());

        // Shuffle
        const shuffleBtn = document.querySelector('.shuffle-btn');
        if (shuffleBtn) {
            if (this.isShuffle) shuffleBtn.classList.add('active');
            shuffleBtn.addEventListener('click', () => {
                this.isShuffle = !this.isShuffle;
                shuffleBtn.classList.toggle('active', this.isShuffle);
                this.saveState();
            });
        }

        // Repeat
        const repeatBtn = document.querySelector('.repeat-btn');
        if (repeatBtn) {
            if (this.isRepeat) repeatBtn.classList.add('active');
            repeatBtn.addEventListener('click', () => {
                this.isRepeat = !this.isRepeat;
                repeatBtn.classList.toggle('active', this.isRepeat);
                this.saveState();
            });
        }

        // Playlist Toggle - Re-attached to be safe
        const plToggle = document.querySelector('.playlist-toggle');
        const plModal = document.getElementById('playlist-modal');
        const plClose = document.querySelector('.close-playlist');

        if (plToggle && plModal) {
            // Clone to remove old listeners
            const newToggle = plToggle.cloneNode(true);
            plToggle.parentNode.replaceChild(newToggle, plToggle);

            newToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                plModal.classList.toggle('active');
                this.renderPlaylist();
            });
        }

        if (plClose && plModal) {
            plClose.addEventListener('click', () => plModal.classList.remove('active'));
        }

        // Progress Bar Seek
        const progBar = document.querySelector('.progress-bar');
        if (progBar) {
            progBar.addEventListener('click', (e) => {
                if (!this.player || !this.player.seekTo) return;
                const rect = progBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = Math.max(0, Math.min(1, clickX / rect.width));
                const duration = this.player.getDuration();
                if (duration) {
                    this.player.seekTo(duration * pct, true);
                }
            });
        }

        // Volume Bar
        const volBar = document.querySelector('.volume-bar');
        if (volBar) {
            volBar.addEventListener('click', (e) => {
                if (!this.player || !this.player.setVolume) return;
                const rect = volBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = Math.max(0, Math.min(1, clickX / rect.width));
                const vol = Math.round(pct * 100);
                this.player.setVolume(vol);
                localStorage.setItem('kalebie_volume', vol);
                this.updateVolumeUI(vol);
            });
        }
    }

    updateVolumeUI(vol) {
        const fill = document.querySelector('.volume-fill');
        if (fill) fill.style.width = `${vol}%`;
    }

    initYouTube() {
        // If API is already ready
        if (window.YT && window.YT.Player) {
            this.createPlayerInstance();
        } else {
            // Setup callback
            window.onYouTubeIframeAPIReady = () => {
                this.createPlayerInstance();
            };

            // Inject script if not present
            if (!document.getElementById('yt-api-script')) {
                const tag = document.createElement('script');
                tag.id = 'yt-api-script';
                tag.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(tag);
            }
        }
    }

    createPlayerInstance() {
        console.log('Creating YT Player Instance');
        this.player = new YT.Player('youtube-player', {
            height: '0',
            width: '0',
            videoId: PL_DATA[this.currentIndex].id,
            playerVars: {
                'autoplay': 1,
                'controls': 0,
                'disablekb': 1,
                'fs': 0,
                'iv_load_policy': 3
            },
            events: {
                'onReady': this.onPlayerReady,
                'onStateChange': this.onPlayerStateChange
            }
        });
    }

    onPlayerReady(event) {
        console.log('Player Ready');
        const storedVol = localStorage.getItem('kalebie_volume') || 50;
        this.player.setVolume(storedVol);
        this.updateVolumeUI(storedVol);

        // Auto-play on load
        try {
            this.player.playVideo();
            localStorage.setItem('kalebie_should_play', 'true');
        } catch (e) {
            console.warn('Autoplay blocked:', e);
        }

        this.startTicker();
    }

    onPlayerStateChange(event) {
        const icon = document.querySelector('.play-pause i');

        if (event.data === YT.PlayerState.PLAYING) {
            this.isPlaying = true;
            if (icon) { icon.classList.remove('fa-play'); icon.classList.add('fa-pause'); }
            localStorage.setItem('kalebie_should_play', 'true');
        } else if (event.data === YT.PlayerState.PAUSED) {
            this.isPlaying = false;
            if (icon) { icon.classList.add('fa-play'); icon.classList.remove('fa-pause'); }
            localStorage.setItem('kalebie_should_play', 'false');
        } else if (event.data === YT.PlayerState.ENDED) {
            if (this.isRepeat) {
                this.player.playVideo();
            } else {
                this.nextTrack(true); // Auto next
            }
        }
    }

    togglePlay() {
        if (!this.player || !this.player.getPlayerState) return;
        const state = this.player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            this.player.pauseVideo();
        } else {
            this.player.playVideo();
        }
    }

    loadTrack(index) {
        if (index < 0) index = PL_DATA.length - 1;
        if (index >= PL_DATA.length) index = 0;

        this.currentIndex = index;
        this.saveState();
        this.updateSongInfo();

        if (this.player && this.player.loadVideoById) {
            this.player.loadVideoById(PL_DATA[this.currentIndex].id);
            // Assuming user interaction (click), we can safe autoplay
            this.player.playVideo();
        }
    }

    nextTrack(auto = false) {
        if (this.isShuffle) {
            let nextIndex = Math.floor(Math.random() * PL_DATA.length);
            // Try not to repeat same song
            if (PL_DATA.length > 1) {
                let attempts = 0;
                while (nextIndex === this.currentIndex && attempts < 5) {
                    nextIndex = Math.floor(Math.random() * PL_DATA.length);
                    attempts++;
                }
            }
            this.loadTrack(nextIndex);
        } else {
            this.loadTrack(this.currentIndex + 1);
        }
    }

    prevTrack() {
        this.loadTrack(this.currentIndex - 1);
    }

    updateSongInfo() {
        const track = PL_DATA[this.currentIndex];
        document.querySelector('.track-name').innerText = track.title;
        document.querySelector('.artist-name').innerText = track.artist;
        document.querySelector('.track-img').src = track.cover;

        // Update active class in playlist
        this.renderPlaylist();
    }

    renderPlaylist() {
        const container = document.getElementById('playlist-items');
        if (!container) return;

        container.innerHTML = PL_DATA.map((track, i) => `
            <div class="playlist-item ${i === this.currentIndex ? 'active' : ''}" data-index="${i}">
                <img src="${track.cover}" loading="lazy">
                <div class="playlist-item-info">
                    <span class="playlist-item-title">${track.title}</span>
                    <span class="playlist-item-artist">${track.artist}</span>
                </div>
            </div>
        `).join('');

        // Add listeners to new items
        container.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.getAttribute('data-index'));
                this.loadTrack(idx);
            });
        });
    }

    startTicker() {
        if (this.progressInterval) clearInterval(this.progressInterval);
        this.progressInterval = setInterval(this.tick, 500);
    }

    tick() {
        if (!this.player || !this.player.getCurrentTime) return;

        try {
            const curr = this.player.getCurrentTime();
            const dur = this.player.getDuration();

            if (dur > 0) {
                const pct = (curr / dur) * 100;
                const fill = document.querySelector('.progress-fill');
                if (fill) fill.style.width = `${pct}%`;

                document.querySelector('.curr-time').innerText = this.formatTime(curr);
                document.querySelector('.total-time').innerText = this.formatTime(dur);
            }
        } catch (e) { }
    }

    formatTime(s) {
        if (!s) return '0:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    }
}

// Instantiate
window.musicApp = new MusicPlayer();
