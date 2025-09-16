"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home,
  MessageSquare,
  Calendar,
  ArrowLeft,
  Clock,
  Shield,
  UserCheck,
  User,
  CheckCircle,
  Video,
  Users,
  BookOpen,
  Plus,
  AlertTriangle,
  Calendar as CalendarIcon,
  ExternalLink,
  MessageCircle,
  Mic,
  MapPin,
  Search,
  Filter,
  X,
  Eye,
  XCircle,
  RotateCcw,
  Send,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Star,
  Headphones,
  RefreshCw,
  Ticket as TicketIcon
} from "lucide-react";
import { HeartIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { RoleBasedSidebar } from "@/components/role-based-sidebar";


// Real YouTube videos with verified availability
const videoResources = [
  {
    id: 1,
    title: "Mindfulness Meditation for Beginners",
    description: "Learn basic mindfulness techniques to reduce stress and improve mental clarity",
    duration: "12:45",
    language: "English",
    category: "Mindfulness",
    rating: 4.9,
    views: "1.8M",
    youtubeId: "ZToicYcHIOU",
    thumbnail: `/Gemini_Generated_Image_ojyeb6ojyeb6ojye.png`
  },
  {
    id: 2,
    title: "Sleep Better Tonight - Guided Sleep Meditation",
    description: "A calming guided meditation to help you fall asleep naturally",
    duration: "30:00",
    language: "English",
    category: "Sleep",
    rating: 4.7,
    views: "3.1M",
    youtubeId: "1vx8iUvfyCY",
    thumbnail: `/Gemini_Generated_Image_q16aw0q16aw0q16a.png`
  },
  {
    id: 3,
    title: "Breathing Exercises for Anxiety Relief",
    description: "Simple breathing techniques to calm anxiety and panic attacks",
    duration: "8:15",
    language: "English",
    category: "Anxiety",
    rating: 4.8,
    views: "1.2M",
    youtubeId: "tybOi4hjZFQ",
    thumbnail: `/Gemini_Generated_Image_pkbxahpkbxahpkbx.png`
  },
  {
    id: 4,
    title: "10 Minute Meditation for Anxiety",
    description: "Quick meditation practice to reduce anxiety and stress",
    duration: "10:00",
    language: "English",
    category: "Anxiety",
    rating: 4.8,
    views: "2.5M",
    youtubeId: "O-6f5wQXSu8",
    thumbnail: `/Gemini_Generated_Image_h86sg9h86sg9h86s.png`
  },
  {
    id: 5,
    title: "Breathing Exercises for Anxiety Relief",
    description: "Simple breathing techniques to calm anxiety and reduce stress instantly",
    duration: "8:42",
    language: "English",
    category: "Anxiety",
    rating: 4.8,
    views: "2.1M",
    youtubeId: "aXItOY0sLRY",
    thumbnail: `/Gemini_Generated_Image_shha9tshha9tshha.png`
  },
  {
    id: 6,
    title: "Morning Meditation for Positive Energy",
    description: "Start your day with positive intentions and mindful awareness",
    duration: "12:00",
    language: "English",
    category: "Mindfulness",
    rating: 4.6,
    views: "900K",
    youtubeId: "inpok4MKVLM",
    thumbnail: `/Gemini_Generated_Image_utxdxwutxdxwutxd.png`
  }
];

// Audio resources using local MP3 files from public folder
const audioResources = [
  {
    id: 1,
    title: "Wings of Dreams",
    description: "Dreamy ambient music for deep relaxation and meditation",
    duration: "3:49",
    language: "Universal",
    category: "Ambient",
    rating: 4.9,
    plays: "45K",
    audioUrl: "/wings-of-dreams-229186.mp3",
    isNature: false
  },
  {
    id: 2,
    title: "Lofi Relax Song",
    description: "Chill lofi beats perfect for studying and stress relief",
    duration: "6:20",
    language: "Universal",
    category: "Lofi",
    rating: 4.8,
    plays: "32K",
    audioUrl: "/lofi-relax-song-386012.mp3",
    isNature: false
  },
  {
    id: 3,
    title: "Calm Flute & Soft Strings",
    description: "Peaceful flute melodies with soft strings for uplifting relaxation",
    duration: "6:30",
    language: "Universal",
    category: "Instrumental",
    rating: 4.9,
    plays: "28K",
    audioUrl: "/calm-flute-soft-strings-slow-rise-to-uplifting-390496.mp3",
    isNature: false
  }
];

// No fallback needed - using local files from public folder

// YouTube Video Player Component
const YouTubePlayer = ({ videoId, title, onClose }: { videoId: string; title: string; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ExternalLink className="w-5 h-5" />
          </Button>
        </div>
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

// Audio Player Component
const AudioPlayer = ({ audio }: { audio: any }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const updateTime = () => setCurrentTime(audioElement.currentTime);
    const updateDuration = () => setDuration(audioElement.duration);

    audioElement.addEventListener('timeupdate', updateTime);
    audioElement.addEventListener('loadedmetadata', updateDuration);
    audioElement.volume = isMuted ? 0 : volume;

    return () => {
      audioElement.removeEventListener('timeupdate', updateTime);
      audioElement.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [volume, isMuted]);

  const togglePlay = async () => {
    const audioElement = audioRef.current;
    if (!audioElement) {
      console.error('Audio element not found');
      return;
    }

    console.log('Audio URL:', audio.audioUrl);
    console.log('Audio element ready state:', audioElement.readyState);

    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      try {
        // Force load the audio
        audioElement.load();
        await audioElement.play();
        setIsPlaying(true);
        console.log('Audio playback started successfully');
      } catch (error) {
        console.error('Audio playback failed:', error);
        console.error('Error details:', {
          name: (error as Error).name,
          message: (error as Error).message,
          audioSrc: audioElement.src,
          readyState: audioElement.readyState,
          networkState: audioElement.networkState
        });
        setIsPlaying(false);
        
        // Try alternative approach
        try {
          audioElement.muted = true;
          await audioElement.play();
          audioElement.muted = false;
          setIsPlaying(true);
          console.log('Audio started with muted workaround');
        } catch (secondError) {
          console.error('Fallback audio play also failed:', secondError);
        }
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border border-gray-200 shadow-lg rounded-xl p-3 sm:p-4 lg:p-6"
    >
      <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
        <motion.button
          onClick={togglePlay}
          className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-1" />
          )}
        </motion.button>
        
        <div className="flex-1">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">{audio.title}</h3>
          <p className="text-xs sm:text-sm text-gray-600">{audio.description}</p>
        </div>
        
        <Badge className="bg-green-100 text-green-700 border-0 text-xs sm:text-sm px-2 py-1">{audio.category}</Badge>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>{formatTime(currentTime)}</span>
          <span>{audio.duration}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Volume Control and Loop */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <button
          onClick={() => setIsLooping(!isLooping)}
          className={`p-1 rounded transition-colors ${
            isLooping ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-600'
          }`}
          title="Toggle Loop"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audio.audioUrl}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => console.error('Audio error:', e.currentTarget.error)}
        onLoadStart={() => console.log('Audio load started')}
        onCanPlay={() => console.log('Audio can play')}
        onLoadedData={() => console.log('Audio loaded data')}
        preload="auto"
        controls={false}
        loop={isLooping}
        crossOrigin="anonymous"
      />
    </motion.div>
  );
};


// Main Resource Hub Component
export default function ResourceHubPage() {
  const [activeTab, setActiveTab] = useState<'videos' | 'audio'>('videos');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  return (
    <div className="min-h-screen bg-white">
      <RoleBasedSidebar />
      
      <div className="md:ml-20 md:pb-0 pb-20 flex min-h-screen">
        <motion.div 
          className="flex-1 p-3 sm:p-6 lg:p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <Card className="bg-white border border-gray-200 shadow-lg rounded-xl mb-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
            <CardContent className="p-3 sm:p-4 lg:p-6">
              {/* Mobile Header */}
              <div className="block sm:hidden">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center border-2 border-blue-300 shadow-md">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Resource Hub
                    </h1>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0 px-2 py-1 text-xs">
                    {videoResources.length + audioResources.length}
                  </Badge>
                </div>
              </div>
              
              {/* Desktop Header */}
              <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50">
                      <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Button>
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center border-2 border-blue-300 shadow-md">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Mental Health Resource Hub
                      </h1>
                      <p className="text-sm text-gray-500">Videos, Audio & Wellness Guides • Evidence-Based Content</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-100 text-green-700 border-0 px-4 py-2">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {videoResources.length + audioResources.length} Resources
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Browse Resources</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Select a category to explore mental health resources</p>
                </div>
                <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
                  {['videos', 'audio'].map((tab) => (
                    <motion.button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-medium transition-all duration-300 capitalize text-sm sm:text-base ${
                        activeTab === tab ? 'bg-white text-blue-600 shadow-md' : 'text-gray-600 hover:text-blue-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {tab === 'videos' && <Video className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 inline" />}
                      {tab === 'audio' && <Headphones className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 inline" />}
                      {tab}
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Content Area */}
          <motion.div className="bg-white">
            <AnimatePresence mode="wait">
              {activeTab === 'videos' && (
                <motion.div key="videos" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                  <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden mb-6 relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="mb-4">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Mental Health Videos</h2>
                        <p className="text-xs sm:text-sm text-gray-600">Professional content from licensed therapists and mental health experts</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                        {videoResources.map((video, index) => (
                          <motion.div
                            key={video.id}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                          >
                            <Card className="bg-white border border-gray-200 shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 cursor-pointer"
                                  onClick={() => setSelectedVideo(video)}>
                              <CardContent className="p-3 sm:p-4 lg:p-6">
                                <div className="relative mb-4 rounded-xl overflow-hidden">
                                  <img 
                                    src={video.thumbnail} 
                                    alt={video.title}
                                    className="w-full h-40 object-cover"
                                    loading="eager"
                                    onLoad={() => console.log(`Thumbnail loaded: ${video.title}`)}
                                  />
                                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                                      <Play className="w-8 h-8 text-white ml-1" />
                                    </div>
                                  </div>
                                  <Badge className="absolute top-2 left-2 bg-black/70 text-white">{video.duration}</Badge>
                                </div>
                                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">{video.title}</h3>
                                <p className="text-xs sm:text-sm text-gray-600 mb-3">{video.description}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-medium">{video.rating}</span>
                                  </div>
                                  <Badge className="bg-blue-100 text-blue-700 border-0">{video.category}</Badge>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              
              {activeTab === 'audio' && (
                <motion.div key="audio" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                  <Card className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden mb-6 relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 to-blue-400"></div>
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Relaxation Audio</h2>
                        <p className="text-xs sm:text-sm text-gray-600">Therapeutic audio content for meditation, focus, and stress relief</p>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        {audioResources.map((audio, index) => (
                          <motion.div
                            key={audio.id}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <AudioPlayer audio={audio} />
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <YouTubePlayer
            videoId={selectedVideo.youtubeId}
            title={selectedVideo.title}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}