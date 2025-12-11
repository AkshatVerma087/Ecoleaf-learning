import { Link } from "react-router-dom";
import { PlayCircle, Clock, BookOpen } from "lucide-react";
import EcoCard from "./EcoCard";
import { cn } from "@/lib/utils";

const CourseCard = ({ course, className }) => {
  const courseId = course._id || course.id;
  return (
    <Link to={`/courses/${courseId}/lesson/1`}>
      <EcoCard className={cn("overflow-hidden p-0", className)}>
        <div className="relative h-40 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <span className="rounded-full bg-primary/90 px-2 py-1 text-xs font-medium text-primary-foreground">
              {course.category}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-1">{course.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {course.lessons !== undefined ? course.lessons : 0} {course.lessons === 1 ? 'lesson' : 'lessons'}
            </span>
            {course.duration && course.duration !== '0m' && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {course.duration}
              </span>
            )}
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-primary">{course.progress !== undefined ? course.progress : 0}%</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-eco-green-light">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${course.progress !== undefined ? course.progress : 0}%` }}
              />
            </div>
          </div>
        </div>
      </EcoCard>
    </Link>
  );
};

export default CourseCard;
