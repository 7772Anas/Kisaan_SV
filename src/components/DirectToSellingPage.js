import React, { useState, useRef, useEffect } from "react";
import { 
  PlayCircle, 
  PauseCircle, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  
  SkipBack,
  SkipForward
} from "lucide-react";
import D2S1 from "../ks-images/D2S1.mp4";

const DirectToSellingPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skipTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  return (
    <div className="font-sans bg-white text-gray-900 min-h-screen w-full">
      {/* HERO SECTION */}
      <section className="w-full flex flex-col items-center justify-center py-12 px-4 md:px-0">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-green-700">
          Kisan Suvidha presents Direct-to-Selling Concept
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-gray-800">
          What is the actual problem in Indian agriculture?
        </h2>
        <p className="max-w-2xl text-center text-base md:text-lg text-gray-600 mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod. Suspendisse potenti. Etiam euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod.
        </p>
      </section>

      {/* SOLUTION SECTION */}
      <section className="w-full flex flex-col items-center justify-center py-10 px-4 bg-gray-50">
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-3 text-green-700">
          How is Kisan Suvidha solving this?
        </h3>
        <p className="max-w-2xl text-center text-base md:text-lg text-gray-700">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Kisan Suvidha enables fair pricing, direct communication between farmers and buyers, and a transparent e-inventory system. This empowers farmers and ensures better outcomes for all stakeholders.
        </p>
      </section>

      {/* VIDEO SECTION */}
      <section className="w-full flex flex-col items-center justify-center py-10 px-4">
        <div className="w-full max-w-4xl">
          <div 
            ref={videoContainerRef}
            className="relative bg-black rounded-2xl shadow-2xl overflow-hidden group"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-full h-auto"
              poster=""
              preload="metadata"
            >
              <source src={D2S1} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
              </div>
            )}

            {/* Video Controls Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              
              {/* Top Controls */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
              </div>

              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={togglePlay}
                  className="p-4 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all duration-300 transform hover:scale-110"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <PauseCircle size={48} /> : <PlayCircle size={48} />}
                </button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={handleProgressChange}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #22c55e 0%, #22c55e ${duration ? (currentTime / duration) * 100 : 0}%, #4b5563 ${duration ? (currentTime / duration) * 100 : 0}%, #4b5563 100%)`
                    }}
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <PauseCircle size={20} /> : <PlayCircle size={20} />}
                    </button>

                    {/* Skip Backward */}
                    <button
                      onClick={() => skipTime(-10)}
                      className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                      title="Skip 10 seconds backward"
                    >
                      <SkipBack size={20} />
                    </button>

                    {/* Skip Forward */}
                    <button
                      onClick={() => skipTime(10)}
                      className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                      title="Skip 10 seconds forward"
                    >
                      <SkipForward size={20} />
                    </button>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleMute}
                        className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : volume * 100}
                        onChange={handleVolumeChange}
                        className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #22c55e 0%, #22c55e ${isMuted ? 0 : volume * 100}%, #4b5563 ${isMuted ? 0 : volume * 100}%, #4b5563 100%)`
                        }}
                      />
                    </div>
                  </div>

                  {/* Time Display */}
                  <div className="flex items-center gap-2 text-white text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <span>/</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Click to Play Overlay (when paused) */}
            {!isPlaying && !showControls && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={togglePlay}
                  className="p-4 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all duration-300 transform hover:scale-110"
                >
                  <PlayCircle size={48} />
                </button>
              </div>
            )}
          </div>

          {/* Video Description */}
          <div className="mt-6 text-center">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              Kisan Suvidha Direct-to-Selling Walkthrough
            </h4>
            <p className="text-gray-600">
              Learn how our platform revolutionizes agricultural commerce by connecting farmers directly with buyers
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="w-full bg-green-800 py-12 px-4 flex flex-col items-center">
        <h4 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
          Want to start your journey?
        </h4>
        <div className="flex flex-col md:flex-row gap-4">
          <button className="px-8 py-3 bg-white text-green-800 font-semibold rounded-lg shadow hover:bg-green-100 transition-colors">
            Login as Farmer
          </button>
          <button className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors">
            Login as Buyer
          </button>
        </div>
      </section>

      {/* Custom CSS for video controls */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider:focus {
          outline: none;
        }

        .slider:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3);
        }

        .slider:focus::-moz-range-thumb {
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3);
        }
      `}</style>
    </div>
  );
};

export default DirectToSellingPage; 