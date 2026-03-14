import { Link } from 'react-router-dom';
import { Star, Clock, BookOpen, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const LEVEL_COLORS = {
  Beginner: 'bg-success/10 text-success border-success/20',
  Intermediate: 'bg-warning/10 text-warning border-warning/20',
  Advanced: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function CourseCard({ course }) {
  return (
    <Link to={`/course/${course.id}`} className="group block">
      <Card className="overflow-hidden border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 h-full bg-card">
        <div className="relative overflow-hidden aspect-video">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Badge className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 border ${LEVEL_COLORS[course.level]}`}>
            {course.level}
          </Badge>
          {course.isEnrolled && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 border-0">
              Enrolled
            </Badge>
          )}
        </div>

        <CardContent className="p-4 flex flex-col gap-3">
          <span className="label-xs">{course.category}</span>

          <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={course.instructorAvatar} />
              <AvatarFallback className="text-[9px]">{course.instructor[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{course.instructor}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 text-warning font-semibold">
              <Star className="h-3 w-3 fill-current" />
              {course.rating}
            </span>
            <span className="text-muted-foreground/60">({course.reviewCount.toLocaleString()})</span>
            <span className="flex items-center gap-1 ml-auto">
              <Clock className="h-3 w-3" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {course.lessons}
            </span>
          </div>

          {course.isEnrolled && course.progress !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-xs font-semibold text-primary">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-1.5" />
            </div>
          )}

          {!course.isEnrolled && (
            <div className="flex items-center justify-between pt-1 border-t border-border">
              <span className="font-bold text-foreground">${course.price}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                {course.enrolled.toLocaleString()} enrolled
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
