var YouTubeClass = function (playerId) {

    var _createPlayerObj = function(videoId, width, height, pvars, events, noCookies) {
        var vars = {
            autoplay: 0,
            rel: 0,
            iv_load_policy: 3,
            controls: 2,
            showinfo: 0,
            fs: 1,
            html5: 1
        };
        $.extend(true, vars, pvars);
        videoId = videoId || '';
        width = width || 640;
        height = height || 390;
        events = events || {};
        _events.onReady = events.onReady || function() { };
        _events.stateChange = events.stateChange || function(state) { };
        _events.playbackQualityChange = events.playbackQualityChange || function(state) { };
        _events.playbackRateChange = events.playbackRateChange || function(newRate) { };
        _events.error = events.error || function() { };
        _events.reportPlayedVideo = events.reportPlayedVideo || function(duration) {};
        
        noCookies = noCookies || false;

        _playerObjIsNeededPromise.then(function() {

            _playerObj = new YT.Player(_playerId, {
                height: height,
                width: width,
                playerVars: vars,
                videoId: videoId,
                events: {
                    'onReady': function() {
                        _playerObjReadyPromise.resolve();
                        _events.onReady();
                    },
                    'onStateChange': function(event) {
                        if (event.data === YouTubeClass.PlayerState.PLAYING) {
                            _playing = true;
                            _counting = false;
                            _playingBefore = true;

                            if (!_started) {
                                _started = true;
                                _startDate = new Date();
                                _lastTempStart = _startDate;
                                //console.log('PLAYING - Start');
                            }
                            else {
                                _lastTempStart = new Date();
                                //console.log('PLAYING - Continue');
                                //continue playing...
                            }
                        }
                        else if (event.data === YouTubeClass.PlayerState.PAUSED) {
                            if (_playing) {
                                _netPlayDuration += (new Date()).getTime()-_lastTempStart.getTime();
                                _counting = true;
                                setTimeout(function(){
                                    _counting = false;
                                    if (_started && !_playing) {
                                        _reportPlayedVideo(_netPlayDuration);
                                    }
                                },5000);
                            }
                            _playing = false;
                        }
                        else if (event.data === YouTubeClass.PlayerState.ENDED) {
                            _counting = false;
                            _endDate = new Date();
                            if (_playing) {
                                _netPlayDuration += (new Date()).getTime()-_lastTempStart.getTime();
                            }
                            //console.log('ENDED - duration is ' + _netPlayDuration);
                            _reportPlayedVideo(_netPlayDuration);
                        }

                        _events.stateChange(event.data);
                    },
                    'onPlaybackQualityChange': function(event) {
                        _events.playbackQualityChange(event.data);
                    },
                    'onPlaybackRateChange': function(event) {
                        _events.playbackRateChange(event.data);
                    },
                    'onError': function(event) {
                        if (!_isErrorRaised) {
                            _isErrorRaised = true;
                            _events.error(event.data);
                        }
                    },
                    'onApiChange': function(event) {

                    }
                }
            });

            if (noCookies) {
                var playerElm = document.getElementById(_playerId);
                playerElm.src = playerElm.src.replace("youtube.com","youtube-nocookie.com");
            }
        });
    };
    
    var _connectPlayerObj = function(pvars, events, noCookies) {
        var vars = {
            autoplay: 0,
            rel: 0,
            iv_load_policy: 3,
            controls: 2,
            showinfo: 0,
            fs: 1,
            html5: 1
        };
        $.extend(true, vars, pvars);
        events = events || {};
        _events.onReady = events.onReady || function() { };
        _events.stateChange = events.stateChange || function(state) { };
        _events.playbackQualityChange = events.playbackQualityChange || function(state) { };
        _events.playbackRateChange = events.playbackRateChange || function(newRate) { };
        _events.error = events.error || function() { };
        _events.reportPlayedVideo = events.reportPlayedVideo || function(duration) {};
        
        noCookies = noCookies || false;
                
        _playerObj = new YT.Player(_playerId, {
            playerVars: vars,
            events: {
                'onReady': function() {
                    _playerObjReadyPromise.resolve();
                    _events.onReady();
                },
                'onStateChange': function(event) {
                    if (event.data === YouTubeClass.PlayerState.PLAYING) {
                        _playing = true;
                        _counting = false;
                        _playingBefore = true;
                        
                        if (!_started) {
                            _started = true;
                            _startDate = new Date();
                            _lastTempStart = _startDate;
                            //console.log('PLAYING - Start');
                        }
                        else {
                            _lastTempStart = new Date();
                            //console.log('PLAYING - Continue');
                            //continue playing...
                        }
                    }
                    else if (event.data === YouTubeClass.PlayerState.PAUSED) {
                        if (_playing) {
                            _netPlayDuration += (new Date()).getTime()-_lastTempStart.getTime();
                            _counting = true;
                            setTimeout(function(){
                                _counting = false;
                                if (_started) {
                                    _reportPlayedVideo(_netPlayDuration);
                                }
                            },5000);
                        }
                        _playing = false;
                    }
                    else if (event.data === YouTubeClass.PlayerState.ENDED) {
                        _counting = false;
                        _endDate = new Date();
                        if (_playing) {
                            _netPlayDuration += (new Date()).getTime()-_lastTempStart.getTime();
                        }
                        //console.log('ENDED - duration is ' + _netPlayDuration);
                        _reportPlayedVideo(_netPlayDuration);
                    }

                    _events.stateChange(event.data);
                },
                'onPlaybackQualityChange': function(event) {
                    _events.playbackQualityChange(event.data);
                },
                'onPlaybackRateChange': function(event) {
                    _events.playbackRateChange(event.data);
                },
                'onError': function(event) {
                    if (!_isErrorRaised) {
                        _isErrorRaised = true;
                        _events.error(event.data);
                    }
                },
                'onApiChange': function(event) {
                    
                }
            }
        });
        
        if (noCookies) {
            var playerElm = document.getElementById(_playerId);
            playerElm.src = playerElm.src.replace("youtube.com","youtube-nocookie.com");
        }

        _playerObjIsNeededPromise.resolve();
    };

    var _destroyPlayerObj = function() {
        if (_playerObj) {
            _playerObj.destroy();
        }
    };

    var _play = function(autoPlay) {
        _playerObjIsNeededPromise.resolve();

        _playerObjReadyPromise.then(function(){
            if (_playingBefore || (!webyclipMobile && autoPlay)) {
                _playerObj.seekTo(0,true);
                _playerObj.playVideo();
            }
        });
    };

    var _continuePlay = function() {
        _playerObjIsNeededPromise.resolve();

        _playerObjReadyPromise.then(function() {
            if (_playingBefore) {
                _playerObj.playVideo();
            }
        });
    };

    var _stop = function() {
        _playerObjIsNeededPromise.resolve();

        _playerObjReadyPromise.then(function() {
            if (_startDate !== null && _endDate === null) {
                if (_playing) {
                    _netPlayDuration += (new Date()).getTime() - _lastTempStart.getTime();
                }
                _reportPlayedVideo(_netPlayDuration);
            }
            _playerObj.pauseVideo();
        });
    };

    var _getCurrentTime = function() {
        _playerObjIsNeededPromise.resolve();

        if (_playerObjReadyPromise.state() !== "resolved") {
            return 0;
        }
        return _playerObj.getCurrentTime();
    };

    var _reportPlayedVideo = function(duration) {
        _events.reportPlayedVideo(duration);
        _playing = false;
        _started = false;
        _startDate = null;
        _lastTempStart = null;
        _endDate = null;
        _netPlayDuration = 0;
    };

    var _beforeUnload = function() {
        if (_playing || (_startDate !== null && _endDate === null)) {
            if (_playing) {
                _netPlayDuration += (new Date()).getTime()-_lastTempStart.getTime();
            }
            //console.log('UNLOAD - duration is ' + _netPlayDuration);
            _reportPlayedVideo(_netPlayDuration);
        }
        //console.log('bye ;-)');
    };

    var _preloadPlayer = function() {
        _playerObjIsNeededPromise.resolve();
    };

    var _getPlayerState = function() {
        _playerObjIsNeededPromise.resolve();

        if (_playerObjReadyPromise.state() !== "resolved") {
            return null;
        }
        return _playerObj.getPlayerState();
    };

    var _events = {};
    
    var _started = false;
    var _playing = false;
    var _startDate = null;
    var _lastTempStart = null;
    var _endDate = null;
    var _netPlayDuration = 0;
    var _counting = false;
    var _playingBefore = false;
    var _isErrorRaised = false;
    
    var _playerId = playerId;
    var _playerObj = null;
    var _playerObjReadyPromise = $.Deferred();
    pageUnloadPromise.then(_beforeUnload);

    var _playerObjIsNeededPromise = $.Deferred();

    this.createPlayerObj = _createPlayerObj;
    this.connectPlayerObj = _connectPlayerObj;
    this.destroyPlayerObj = _destroyPlayerObj;       
    this.play = _play;
    this.continuePlay = _continuePlay;
    this.stop = _stop;
    this.getCurrentTime = _getCurrentTime;
    this.preloadPlayer = _preloadPlayer;
    this.getPlayerState = _getPlayerState;
};

YouTubeClass.IframeAPIReadyPromise = $.Deferred();
YouTubeClass.PlayerState = {};
YouTubeClass.PlayerState.UNSTARTED = -1;
YouTubeClass.PlayerState.ENDED = 0;
YouTubeClass.PlayerState.PLAYING = 1;
YouTubeClass.PlayerState.PAUSED = 2;
YouTubeClass.PlayerState.BUFFERING = 3;
YouTubeClass.PlayerState.CUED = 5;

YouTubeClass.QualityState = {};
YouTubeClass.QualityState.SMALL = "small";
YouTubeClass.QualityState.MEDIUM = "medium";
YouTubeClass.QualityState.LARGE = "large";
YouTubeClass.QualityState.HD720 = "hd720";
YouTubeClass.QualityState.HD1080 = "hd1080";
YouTubeClass.QualityState.HIGHRES = "highres";

YouTubeClass.ErrorState = {};
YouTubeClass.ErrorState.INVALID_PARAMETER = 2;
YouTubeClass.ErrorState.HTML5_ERROR = 5;
YouTubeClass.ErrorState.NOT_FOUND = 100;
YouTubeClass.ErrorState.NOT_SUPPORTED = 101;
YouTubeClass.ErrorState.NOT_SUPPORTED2 = 150;

function onYouTubeIframeAPIReady() {
    YouTubeClass.IframeAPIReadyPromise.resolve();
}

loadJavaScriptResourceByUrl("https://www.youtube.com/iframe_api", function() {});
