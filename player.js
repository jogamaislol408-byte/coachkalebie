var PL_DATA = [
    { title: 'Awaken', artist: 'Valerie Broussard', id: 'qWzKLw6rpiQ', cover: 'https://img.youtube.com/vi/qWzKLw6rpiQ/maxresdefault.jpg' },
    { title: 'RISE', artist: 'The Glitch Mob, Mako', id: '_2uHC0FluU4', cover: 'https://img.youtube.com/vi/_2uHC0FluU4/maxresdefault.jpg' },
    { title: 'THE COMEBACK', artist: 'Geniuz', id: 'WiB5us3rPaA', cover: 'https://img.youtube.com/vi/WiB5us3rPaA/maxresdefault.jpg' },
    { title: 'Burn It All Down', artist: 'PVRIS', id: 'f6Qkwtq2BG4', cover: 'https://img.youtube.com/vi/f6Qkwtq2BG4/maxresdefault.jpg' },
    { title: 'GODS', artist: 'NewJeans', id: 'qA4FcLuL8Ts', cover: 'https://img.youtube.com/vi/qA4FcLuL8Ts/maxresdefault.jpg' }
];

window._musicReady = false;
window._musicPlayRequested = false;

var MusicPlayer = (function () {
    function MP() {
        this.player = null;
        this.currentIndex = 0;
        this.isShuffle = false;
        this.isRepeat = false;
        this.isPlaying = false;
        this.progressInterval = null;
        this.loadState();
        this.onPlayerReady = this.onPlayerReady.bind(this);
        this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
        this.tick = this.tick.bind(this);
        this._setupAutoplayBypass();
        this.initYouTube();
        this._waitForUI();
    }

    MP.prototype._waitForUI = function () {
        var self = this;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () { self.initUI(); });
        } else {
            this.initUI();
        }
    };

    MP.prototype.loadState = function () {
        try {
            var idx = parseInt(localStorage.getItem('kalebie_track_index'));
            this.currentIndex = (isNaN(idx) || idx < 0 || idx >= PL_DATA.length) ? 0 : idx;
            this.isShuffle = localStorage.getItem('kalebie_shuffle') === 'true';
            this.isRepeat = localStorage.getItem('kalebie_repeat') === 'true';
        } catch (_) {
            this.currentIndex = 0;
        }
    };

    MP.prototype.saveState = function () {
        localStorage.setItem('kalebie_track_index', this.currentIndex);
        localStorage.setItem('kalebie_shuffle', this.isShuffle);
        localStorage.setItem('kalebie_repeat', this.isRepeat);
    };

    MP.prototype._setupAutoplayBypass = function () {
        var self = this;
        var events = ['click', 'touchstart', 'keydown', 'scroll', 'mousemove'];
        function handler() {
            if (self.player && typeof self.player.playVideo === 'function' && !self.isPlaying) {
                try {
                    var vol = parseInt(localStorage.getItem('kalebie_volume')) || 50;
                    self.player.setVolume(vol);
                    self.player.playVideo();
                } catch (_) { }
            }
            events.forEach(function (ev) { document.removeEventListener(ev, handler, { capture: true }); });
        }
        events.forEach(function (ev) { document.addEventListener(ev, handler, { capture: true, passive: true }); });
    };

    MP.prototype.initUI = function () {
        var self = this;
        this.updateSongInfo();
        this.renderPlaylist();

        var playPause = document.querySelector('.play-pause');
        if (playPause) playPause.addEventListener('click', function () { self.togglePlay(); });

        var prevBtn = document.querySelector('.prev-btn');
        if (prevBtn) prevBtn.addEventListener('click', function () { self.prevTrack(); });

        var nextBtn = document.querySelector('.next-btn');
        if (nextBtn) nextBtn.addEventListener('click', function () { self.nextTrack(); });

        var shuffleBtn = document.querySelector('.shuffle-btn');
        if (shuffleBtn) {
            if (this.isShuffle) shuffleBtn.classList.add('active');
            shuffleBtn.addEventListener('click', function () {
                self.isShuffle = !self.isShuffle;
                shuffleBtn.classList.toggle('active', self.isShuffle);
                self.saveState();
            });
        }

        var repeatBtn = document.querySelector('.repeat-btn');
        if (repeatBtn) {
            if (this.isRepeat) repeatBtn.classList.add('active');
            repeatBtn.addEventListener('click', function () {
                self.isRepeat = !self.isRepeat;
                repeatBtn.classList.toggle('active', self.isRepeat);
                self.saveState();
            });
        }

        var plToggle = document.querySelector('.playlist-toggle');
        var plModal = document.getElementById('playlist-modal');
        var plClose = document.querySelector('.close-playlist');

        if (plToggle && plModal) {
            var newToggle = plToggle.cloneNode(true);
            plToggle.parentNode.replaceChild(newToggle, plToggle);
            newToggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                plModal.classList.toggle('active');
                self.renderPlaylist();
            });
        }

        if (plClose && plModal) {
            plClose.addEventListener('click', function () { plModal.classList.remove('active'); });
        }

        var progBar = document.querySelector('.progress-bar');
        if (progBar) {
            progBar.addEventListener('click', function (e) {
                if (!self.player || !self.player.seekTo) return;
                var rect = progBar.getBoundingClientRect();
                var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                var duration = self.player.getDuration();
                if (duration) self.player.seekTo(duration * pct, true);
            });
        }

        var volBar = document.querySelector('.volume-bar');
        if (volBar) {
            volBar.addEventListener('click', function (e) {
                if (!self.player || !self.player.setVolume) return;
                var rect = volBar.getBoundingClientRect();
                var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                var vol = Math.round(pct * 100);
                self.player.setVolume(vol);
                localStorage.setItem('kalebie_volume', vol);
                self.updateVolumeUI(vol);
            });
        }
    };

    MP.prototype.updateVolumeUI = function (vol) {
        var fill = document.querySelector('.volume-fill');
        if (fill) fill.style.width = vol + '%';
    };

    MP.prototype.initYouTube = function () {
        var self = this;
        if (window.YT && window.YT.Player) {
            this._ensurePlayerDiv();
            this.createPlayerInstance();
        } else {
            var prevCallback = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = function () {
                if (prevCallback) prevCallback();
                self._ensurePlayerDiv();
                self.createPlayerInstance();
            };
        }
    };

    MP.prototype._ensurePlayerDiv = function () {
        if (!document.getElementById('youtube-player')) {
            var div = document.createElement('div');
            div.id = 'youtube-player';
            div.style.cssText = 'position:absolute;top:-999px;left:-999px;opacity:0;pointer-events:none;';
            document.body.appendChild(div);
        }
    };

    MP.prototype.createPlayerInstance = function () {
        this.player = new YT.Player('youtube-player', {
            height: '0',
            width: '0',
            videoId: PL_DATA[this.currentIndex].id,
            playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3 },
            events: { onReady: this.onPlayerReady, onStateChange: this.onPlayerStateChange }
        });
    };

    MP.prototype.onPlayerReady = function () {
        var self = this;
        var storedVol = parseInt(localStorage.getItem('kalebie_volume')) || 50;
        this.player.setVolume(storedVol);
        this.updateVolumeUI(storedVol);
        window._musicReady = true;

        try { this.player.playVideo(); } catch (_) { }

        if (window._musicPlayRequested) {
            this.forcePlay();
        }

        var retries = 0;
        var retry = setInterval(function () {
            retries++;
            if (self.isPlaying || retries > 15) { clearInterval(retry); return; }
            try { self.player.playVideo(); } catch (_) { }
        }, 500);

        this.startTicker();
    };

    MP.prototype.forcePlay = function () {
        if (!this.player) return;
        try {
            var vol = parseInt(localStorage.getItem('kalebie_volume')) || 50;
            this.player.setVolume(vol);
            this.player.playVideo();
        } catch (_) { }
    };

    MP.prototype.onPlayerStateChange = function (event) {
        var icon = document.querySelector('.play-pause i');
        if (event.data === YT.PlayerState.PLAYING) {
            this.isPlaying = true;
            if (icon) { icon.classList.remove('fa-play'); icon.classList.add('fa-pause'); }
        } else if (event.data === YT.PlayerState.PAUSED) {
            this.isPlaying = false;
            if (icon) { icon.classList.add('fa-play'); icon.classList.remove('fa-pause'); }
        } else if (event.data === YT.PlayerState.ENDED) {
            if (this.isRepeat) {
                this.player.playVideo();
            } else {
                this.nextTrack();
            }
        }
    };

    MP.prototype.togglePlay = function () {
        if (!this.player || !this.player.getPlayerState) return;
        if (this.player.getPlayerState() === YT.PlayerState.PLAYING) {
            this.player.pauseVideo();
        } else {
            this.player.playVideo();
        }
    };

    MP.prototype.loadTrack = function (index) {
        if (index < 0) index = PL_DATA.length - 1;
        if (index >= PL_DATA.length) index = 0;
        this.currentIndex = index;
        this.saveState();
        this.updateSongInfo();
        if (this.player && this.player.loadVideoById) {
            this.player.loadVideoById(PL_DATA[this.currentIndex].id);
            this.player.playVideo();
        }
    };

    MP.prototype.nextTrack = function () {
        if (this.isShuffle) {
            var next = Math.floor(Math.random() * PL_DATA.length);
            if (PL_DATA.length > 1) {
                var tries = 0;
                while (next === this.currentIndex && tries < 5) {
                    next = Math.floor(Math.random() * PL_DATA.length);
                    tries++;
                }
            }
            this.loadTrack(next);
        } else {
            this.loadTrack(this.currentIndex + 1);
        }
    };

    MP.prototype.prevTrack = function () {
        this.loadTrack(this.currentIndex - 1);
    };

    MP.prototype.updateSongInfo = function () {
        var track = PL_DATA[this.currentIndex];
        var name = document.querySelector('.track-name');
        var artist = document.querySelector('.artist-name');
        var img = document.querySelector('.track-img');
        if (name) name.innerText = track.title;
        if (artist) artist.innerText = track.artist;
        if (img) img.src = track.cover;
        this.renderPlaylist();
    };

    MP.prototype.renderPlaylist = function () {
        var self = this;
        var container = document.getElementById('playlist-items');
        if (!container) return;
        container.innerHTML = PL_DATA.map(function (track, i) {
            return '<div class="playlist-item ' + (i === self.currentIndex ? 'active' : '') + '" data-index="' + i + '">' +
                '<img src="' + track.cover + '" loading="lazy">' +
                '<div class="playlist-item-info">' +
                '<span class="playlist-item-title">' + track.title + '</span>' +
                '<span class="playlist-item-artist">' + track.artist + '</span>' +
                '</div></div>';
        }).join('');
        container.querySelectorAll('.playlist-item').forEach(function (item) {
            item.addEventListener('click', function () {
                self.loadTrack(parseInt(item.getAttribute('data-index')));
            });
        });
    };

    MP.prototype.startTicker = function () {
        var self = this;
        if (this.progressInterval) clearInterval(this.progressInterval);
        this.progressInterval = setInterval(this.tick, 500);

        // Pause ticker when tab is hidden to save CPU
        if (!this._visibilityHandlerAdded) {
            this._visibilityHandlerAdded = true;
            document.addEventListener('visibilitychange', function () {
                if (document.hidden) {
                    if (self.progressInterval) {
                        clearInterval(self.progressInterval);
                        self.progressInterval = null;
                    }
                } else {
                    if (!self.progressInterval) {
                        self.progressInterval = setInterval(self.tick, 500);
                    }
                }
            });
        }
    };

    MP.prototype.tick = function () {
        if (!this.player || !this.player.getCurrentTime) return;
        try {
            var curr = this.player.getCurrentTime();
            var dur = this.player.getDuration();
            if (dur > 0) {
                var fill = document.querySelector('.progress-fill');
                if (fill) fill.style.width = (curr / dur * 100) + '%';
                var ct = document.querySelector('.curr-time');
                var tt = document.querySelector('.total-time');
                if (ct) ct.innerText = this.formatTime(curr);
                if (tt) tt.innerText = this.formatTime(dur);
            }
        } catch (_) { }
    };

    MP.prototype.formatTime = function (s) {
        if (!s) return '0:00';
        var m = Math.floor(s / 60);
        var sec = Math.floor(s % 60);
        return m + ':' + (sec < 10 ? '0' : '') + sec;
    };

    return MP;
})();

window.musicApp = new MusicPlayer();
