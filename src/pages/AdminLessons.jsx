import { useState, useEffect } from "react";
import { Plus, Upload, Pencil, Trash2, Video, X } from "lucide-react";
import EcoCard from "@/components/ui/EcoCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { coursesAPI, lessonsAPI } from "@/services/api";

const AdminLessons = () => {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    duration: "",
    videoUrl: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await coursesAPI.getAll();
        setCourses(coursesData);
        
        // Fetch lessons for each course
        const lessonsMap = {};
        for (const course of coursesData) {
          try {
            const courseLessons = await lessonsAPI.getByCourse(course._id || course.id);
            lessonsMap[course._id || course.id] = courseLessons;
          } catch (error) {
            lessonsMap[course._id || course.id] = [];
          }
        }
        setLessons(lessonsMap);
      } catch (error) {
        toast.error(error.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if it's a video file
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        // For now, we'll use a placeholder URL since we don't have file upload backend
        // In production, you'd upload to cloud storage (S3, Cloudinary, etc.)
        setFormData({ ...formData, videoUrl: URL.createObjectURL(file) });
        toast.info("Video selected. Note: In production, this would upload to cloud storage.");
      } else {
        toast.error("Please select a video file");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let finalVideoUrl = formData.videoUrl;
      
      // If video file is selected, upload it first
      if (videoFile) {
        try {
          toast.info("Uploading video...");
          const uploadResult = await lessonsAPI.uploadVideo(videoFile);
          // Get the full URL (backend returns relative path, we need to make it absolute)
          const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
          finalVideoUrl = `${baseUrl}${uploadResult.videoUrl}`;
          toast.success("Video uploaded successfully!");
        } catch (uploadError) {
          toast.error(uploadError.message || "Failed to upload video");
          setUploading(false);
          return;
        }
      }
      
      // Create lesson with video URL
      await lessonsAPI.create({
        title: formData.title,
        course: formData.course,
        duration: formData.duration,
        videoUrl: finalVideoUrl,
      });
      toast.success("Lesson created successfully!");
      setShowModal(false);
      setFormData({ title: "", course: "", duration: "", videoUrl: "" });
      setVideoFile(null);
      
      // Refresh all lessons
      const coursesData = await coursesAPI.getAll();
      const lessonsMap = {};
      for (const course of coursesData) {
        try {
          const courseLessons = await lessonsAPI.getByCourse(course._id || course.id);
          lessonsMap[course._id || course.id] = courseLessons;
        } catch (error) {
          lessonsMap[course._id || course.id] = [];
        }
      }
      setLessons(lessonsMap);
    } catch (error) {
      toast.error(error.message || "Failed to create lesson");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (lessonId) => {
    try {
      await lessonsAPI.delete(lessonId);
      toast.success("Lesson deleted successfully!");
      // Refresh lessons for all courses
      const coursesData = await coursesAPI.getAll();
      const lessonsMap = {};
      for (const course of coursesData) {
        try {
          const courseLessons = await lessonsAPI.getByCourse(course._id || course.id);
          lessonsMap[course._id || course.id] = courseLessons;
        } catch (error) {
          lessonsMap[course._id || course.id] = [];
        }
      }
      setLessons(lessonsMap);
    } catch (error) {
      toast.error(error.message || "Failed to delete lesson");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Lessons</h1>
          <p className="mt-2 text-muted-foreground">
            Upload and manage video lessons for your courses.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Lesson
        </Button>
      </div>

      {/* Lessons by Course */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="space-y-8">
          {courses.map((course) => {
            const courseId = course._id || course.id;
            const courseLessons = lessons[courseId] || [];
            return (
              <EcoCard key={courseId} hover={false}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {courseLessons.length} lessons • {course.duration}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {courseLessons.map((lesson, index) => {
                    const lessonId = lesson._id || lesson.id;
                    return (
                      <div
                        key={lessonId}
                        className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                      >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {index + 1}. {lesson.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(lessonId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </EcoCard>
            );
          })}
        </div>
      )}

      {/* Add Lesson Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Add New Lesson</h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Lesson Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Course</label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-primary"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course._id || course.id} value={course._id || course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 15:30"
                  className="h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Video URL or Upload</label>
                <input
                  type="text"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                  className="mb-2 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-primary"
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-input hover:border-primary transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                      <p className="mt-1 text-sm text-muted-foreground">
                        {videoFile ? videoFile.name : "Click to upload video file"}
                      </p>
                      {videoFile && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </label>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  You can either paste a video URL or upload a video file
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={uploading}>
                  {uploading ? "Creating..." : "Create Lesson"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLessons;
