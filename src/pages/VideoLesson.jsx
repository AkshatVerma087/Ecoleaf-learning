import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Play, 
  CheckCircle, 
  Circle, 
  ChevronLeft, 
  BookOpen,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import EcoCard from "@/components/ui/EcoCard";
import { toast } from "sonner";
import { coursesAPI, lessonsAPI } from "@/services/api";

const VideoLesson = () => {
  const { courseId, lessonId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Helper to get video URL - handle both absolute and relative URLs
  const getVideoUrl = (url) => {
    if (!url) return '';
    // If it's already a full URL (starts with http:// or https://), return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // If it's a relative URL starting with /uploads, make it absolute
    if (url.startsWith('/uploads')) {
      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      return `${baseUrl}${url}`;
    }
    // Otherwise return as is
    return url;
  };

  // Helper function to check if URL is YouTube or Vimeo
  const isYouTubeUrl = (url) => {
    if (!url) return false;
    return /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/.test(url);
  };

  const isVimeoUrl = (url) => {
    if (!url) return false;
    return /vimeo\.com\/(\d+)/.test(url);
  };

  // Convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  };

  // Convert Vimeo URL to embed format
  const getVimeoEmbedUrl = (url) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}`;
    }
    return url;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, lessonsData] = await Promise.all([
          coursesAPI.getById(courseId),
          lessonsAPI.getByCourse(courseId),
        ]);
        setCourse(courseData);
        setLessons(lessonsData);
        
        // Get the lesson from the list first
        const lessonFromList = lessonsData[parseInt(lessonId) - 1] || lessonsData[0];
        
        // Then fetch the full lesson data with notes from database
        if (lessonFromList) {
          const fullLessonData = await lessonsAPI.getById(lessonFromList._id || lessonFromList.id);
          setCurrentLesson(fullLessonData);
          // Load notes from database (will be empty string if no notes saved)
          setNotes(fullLessonData.notes || "");
        } else {
          setCurrentLesson(lessonFromList);
          setNotes(lessonFromList?.notes || "");
        }
        
        setIsPlaying(false);
        setVideoError(false);
      } catch (error) {
        toast.error(error.message || "Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, lessonId]);

  const handleMarkComplete = async () => {
    if (!currentLesson || currentLesson.completed) return; // Prevent double completion
    try {
      const result = await lessonsAPI.complete(currentLesson._id || currentLesson.id);
      if (result.leveledUp) {
        toast.success(`🎉 Level Up! You reached Level ${result.level}! +${result.xpEarned} XP earned 🎉`, {
          duration: 5000,
        });
      } else {
        toast.success(`Lesson marked as complete! +${result.xpEarned} XP earned 🎉`);
      }
      // Refresh lesson data
      const updatedLesson = await lessonsAPI.getById(currentLesson._id || currentLesson.id);
      setCurrentLesson(updatedLesson);
      
      // Refresh lessons list to show completion status
      const lessonsData = await lessonsAPI.getByCourse(courseId);
      setLessons(lessonsData);
      
      // Trigger dashboard refresh
      window.dispatchEvent(new Event('dashboard-refresh'));
    } catch (error) {
      toast.error(error.message || "Failed to complete lesson");
    }
  };

  const handleSaveNotes = async () => {
    if (!currentLesson) return;
    try {
      await lessonsAPI.saveNotes(currentLesson._id || currentLesson.id, notes);
      toast.success("Notes saved successfully! They will be available even after logout.");
      
      // Refresh lesson data to ensure notes are synced with database
      const updatedLesson = await lessonsAPI.getById(currentLesson._id || currentLesson.id);
      setCurrentLesson(updatedLesson);
      // Ensure notes state is synced
      if (updatedLesson.notes !== undefined) {
        setNotes(updatedLesson.notes);
      }
    } catch (error) {
      toast.error(error.message || "Failed to save notes");
    }
  };

  if (loading || !course || !currentLesson) {
    return <div className="animate-fade-in">Loading...</div>;
  }

  return (
    <div className="animate-fade-in">
      {/* Back button */}
      <Link
        to="/courses"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Courses
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Video Player & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <EcoCard className="overflow-hidden p-0" hover={false}>
            <div className="relative aspect-video bg-eco-forest">
              {currentLesson.videoUrl && currentLesson.videoUrl.trim() !== '' ? (
                <>
                  {isYouTubeUrl(currentLesson.videoUrl) ? (
                    <iframe
                      key={currentLesson._id || currentLesson.id}
                      src={getYouTubeEmbedUrl(currentLesson.videoUrl) + '?enablejsapi=1'}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={currentLesson.title}
                      id={`youtube-player-${currentLesson._id || currentLesson.id}`}
                    />
                  ) : isVimeoUrl(currentLesson.videoUrl) ? (
                    <iframe
                      key={currentLesson._id || currentLesson.id}
                      src={getVimeoEmbedUrl(currentLesson.videoUrl)}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={currentLesson.title}
                    />
                  ) : (
                    <>
                      {!isPlaying && !videoError ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                          <button
                            onClick={() => setIsPlaying(true)}
                            className="flex flex-col items-center text-white transition-transform hover:scale-110"
                          >
                            <div className="mb-4 flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                              <Play className="h-10 w-10 text-white" fill="white" />
                            </div>
                            <p className="text-lg font-medium">{currentLesson.title}</p>
                            <p className="text-sm text-white/70">{course.title}</p>
                          </button>
                        </div>
                      ) : null}
                      <video
                        key={currentLesson._id || currentLesson.id}
                        className="w-full h-full object-contain"
                        controls
                        autoPlay={isPlaying}
                        onPlay={() => {
                          setIsPlaying(true);
                          setVideoError(false);
                        }}
                        onPause={() => setIsPlaying(false)}
                        onEnded={async () => {
                          // Auto-complete lesson when video ends (only if not already completed)
                          if (!currentLesson.completed) {
                            try {
                              const result = await lessonsAPI.complete(currentLesson._id || currentLesson.id);
                              // Refresh lesson data
                              const updatedLesson = await lessonsAPI.getById(currentLesson._id || currentLesson.id);
                              setCurrentLesson(updatedLesson);
                              
                              // Only show XP message if XP was actually awarded (not already completed)
                              if (result.xpEarned > 0) {
                                if (result.leveledUp) {
                                  toast.success(`🎉 Level Up! You reached Level ${result.level}! +${result.xpEarned} XP earned 🎉`, {
                                    duration: 5000,
                                  });
                                } else {
                                  toast.success(`Lesson completed! +${result.xpEarned} XP earned 🎉`);
                                }
                              } else {
                                toast.success(`Lesson completed!`);
                              }
                              
                              // Refresh lessons list to show completion status
                              const lessonsData = await lessonsAPI.getByCourse(courseId);
                              setLessons(lessonsData);
                              
                              // Trigger dashboard refresh
                              window.dispatchEvent(new Event('dashboard-refresh'));
                            } catch (error) {
                              toast.error(error.message || "Failed to mark lesson as complete");
                            }
                          }
                        }}
                        onError={(e) => {
                          console.error('Video error:', e);
                          console.error('Video URL:', currentLesson.videoUrl);
                          setVideoError(true);
                          setIsPlaying(false);
                        }}
                        onLoadedMetadata={() => {
                          setVideoError(false);
                        }}
                        onCanPlay={() => {
                          setVideoError(false);
                        }}
                      >
                        <source src={getVideoUrl(currentLesson.videoUrl)} type="video/mp4" />
                        <source src={getVideoUrl(currentLesson.videoUrl)} type="video/webm" />
                        <source src={getVideoUrl(currentLesson.videoUrl)} type="video/ogg" />
                        Your browser does not support the video tag.
                      </video>
                      {videoError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                          <div className="flex flex-col items-center text-white text-center px-4">
                            <p className="text-lg font-medium mb-2">Video Error</p>
                            <p className="text-sm text-white/70 mb-2">Unable to load video. Please check the video URL.</p>
                            <p className="text-xs text-white/50 mb-4 break-all">{currentLesson.videoUrl}</p>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => {
                                  setVideoError(false);
                                  setIsPlaying(false);
                                  // Try to reload the video
                                  const video = document.querySelector('video');
                                  if (video) {
                                    video.load();
                                  }
                                }}
                                variant="outline"
                                className="text-white border-white hover:bg-white/20"
                              >
                                Try Again
                              </Button>
                              <Button
                                onClick={handleMarkComplete}
                                variant="outline"
                                className="text-white border-white hover:bg-white/20"
                              >
                                Mark Complete Anyway
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center text-white">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      <Play className="h-10 w-10 text-white" fill="white" />
                    </div>
                    <p className="text-lg font-medium">{currentLesson.title}</p>
                    <p className="text-sm text-white/70">{course.title}</p>
                    <p className="mt-2 text-xs text-white/50">No video available</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {currentLesson.title}
                  </h2>
                </div>
                {!currentLesson.completed ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleMarkComplete} 
                    className="gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark Complete
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Completed</span>
                  </div>
                )}
              </div>
            </div>
          </EcoCard>

          {/* Notes Section */}
          <EcoCard hover={false}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <BookOpen className="h-5 w-5" />
                Your Notes
              </h3>
              <Button variant="outline" size="sm" onClick={handleSaveNotes} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Take notes while watching the lesson..."
              className="min-h-[150px] w-full rounded-lg border border-input bg-background p-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </EcoCard>
        </div>

        {/* Lesson List Sidebar */}
        <div>
          <EcoCard hover={false}>
            <h3 className="mb-4 text-lg font-semibold text-foreground">Lessons</h3>
            <div className="space-y-2">
              {lessons.map((lesson, index) => {
                const lessonId = lesson._id || lesson.id;
                const currentLessonId = currentLesson._id || currentLesson.id;
                return (
                  <button
                    key={lessonId}
                    onClick={async () => {
                      try {
                        const lessonData = await lessonsAPI.getById(lessonId);
                        setCurrentLesson(lessonData);
                        // Load notes from database (will be empty string if no notes saved)
                        setNotes(lessonData.notes || "");
                        setIsPlaying(false);
                        setVideoError(false);
                      } catch (error) {
                        toast.error("Failed to load lesson");
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                      currentLessonId === lessonId
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent"
                    }`}
                  >
                    {lesson.completed ? (
                      <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {lesson.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </EcoCard>
        </div>
      </div>
    </div>
  );
};

export default VideoLesson;
