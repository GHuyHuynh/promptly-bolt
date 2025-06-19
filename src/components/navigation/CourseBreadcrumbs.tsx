import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { ChevronRight, Home, Book, Play } from 'lucide-react';
import { useCourseContent } from '../../hooks/useCourse';
import { Course, Lesson } from '../../types/course';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface CourseBreadcrumbsProps {
  customItems?: BreadcrumbItem[];
  className?: string;
}

export const CourseBreadcrumbs: React.FC<CourseBreadcrumbsProps> = ({
  customItems = [],
  className = ''
}) => {
  const params = useParams();
  const location = useLocation();
  const { getCourse, fetchLessons } = useCourseContent();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setLoading(true);

        // Get course data if courseId is in params
        if (params.courseId) {
          const courseData = await getCourse(params.courseId);
          setCourse(courseData);

          // Get lesson data if lessonId is in params
          if (params.lessonId && courseData) {
            const lessons = await fetchLessons(params.courseId);
            const lessonData = lessons.find(l => l.id === params.lessonId);
            setLesson(lessonData || null);
          }
        }
      } catch (error) {
        console.error('Error loading course data for breadcrumbs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [params.courseId, params.lessonId, getCourse, fetchLessons]);

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      {
        label: 'Dashboard',
        href: '/app',
        icon: <Home className="w-4 h-4" />
      }
    ];

    // Add custom items at the beginning (after Dashboard)
    breadcrumbs.push(...customItems);

    const pathname = location.pathname;

    // Courses section
    if (pathname.includes('/courses')) {
      breadcrumbs.push({
        label: 'Courses',
        href: '/app/courses',
        icon: <Book className="w-4 h-4" />
      });

      // Specific course
      if (params.courseId && course) {
        breadcrumbs.push({
          label: course.title,
          href: `/app/courses/${params.courseId}`
        });

        // Specific lesson
        if (params.lessonId && lesson) {
          breadcrumbs.push({
            label: lesson.title,
            icon: <Play className="w-4 h-4" />
          });
        }
      }
    }

    // Course progress section
    if (pathname.includes('/course-progress')) {
      breadcrumbs.push({
        label: 'Course Progress',
        href: '/app/course-progress'
      });
    }

    // Achievements section
    if (pathname.includes('/achievements')) {
      breadcrumbs.push({
        label: 'Achievements',
        href: '/app/achievements'
      });
    }

    return breadcrumbs;
  };

  if (loading && (params.courseId || params.lessonId)) {
    return (
      <nav className={`flex items-center space-x-2 text-sm ${className}`}>
        <div className="flex items-center space-x-2 animate-pulse">
          <div className="w-4 h-4 bg-neutral-300 rounded"></div>
          <div className="w-20 h-4 bg-neutral-300 rounded"></div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
          <div className="w-16 h-4 bg-neutral-300 rounded"></div>
        </div>
      </nav>
    );
  }

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-neutral-400 mx-2" />
            )}
            {item.href ? (
              <Link
                to={item.href}
                className="flex items-center space-x-1 text-neutral-600 hover:text-primary-600 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="flex items-center space-x-1 text-neutral-900 font-medium">
                {item.icon}
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Helper component for course-specific breadcrumbs
export const CoursePageBreadcrumbs: React.FC<{
  courseTitle?: string;
  lessonTitle?: string;
  className?: string;
}> = ({ courseTitle, lessonTitle, className }) => {
  const customItems: BreadcrumbItem[] = [];

  if (courseTitle && !lessonTitle) {
    customItems.push({
      label: courseTitle
    });
  }

  if (courseTitle && lessonTitle) {
    customItems.push(
      {
        label: courseTitle,
        href: `/app/courses/${useParams().courseId}`
      },
      {
        label: lessonTitle,
        icon: <Play className="w-4 h-4" />
      }
    );
  }

  return <CourseBreadcrumbs customItems={customItems} className={className} />;
};