import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import CourseCard from "@/components/ui/CourseCard";
import { Button } from "@/components/ui/button";
import { coursesAPI } from "@/services/api";
import { toast } from "sonner";

const categories = ["All", "Climate", "Lifestyle", "Energy", "Wildlife", "Gardening"];

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await coursesAPI.getAll();
        setCourses(data);
      } catch (error) {
        toast.error(error.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Update search from URL params
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearch(searchParam);
    }
  }, [searchParams]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Courses</h1>
        <p className="mt-2 text-muted-foreground">
          Explore eco-friendly courses and build sustainable knowledge.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="whitespace-nowrap rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="text-center py-12">Loading courses...</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id || course.id} course={course} />
          ))}
        </div>
      )}

      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="text-lg font-semibold text-foreground">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
