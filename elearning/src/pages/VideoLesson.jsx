import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  CheckCircle, Circle, ChevronLeft, ChevronRight,
  Video, Brain, FileText, PanelLeftClose, PanelLeft,
  BookOpen, MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import VideoPlayer from '@/components/video/VideoPlayer';
import useStore from '@/store/useStore';
import { toast } from 'sonner';

const LESSON_ICON = { video: Video, quiz: Brain, reading: FileText };

export default function VideoLesson() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { courses, markLessonComplete, notes, setNote } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const course = courses.find((c) => c.id === courseId);
  const allLessons = course?.curriculum.flatMap((s, si) =>
    s.lessons.map((l) => ({ ...l, section: s.section, sectionIndex: si }))
  ) ?? [];
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const lesson = allLessons[currentIndex];
  const prevLesson = allLessons[currentIndex - 1];
  const nextLesson = allLessons[currentIndex + 1];

  const completedCount = allLessons.filter((l) => l.completed).length;
  const progress = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  const handleMarkComplete = () => {
    markLessonComplete(courseId, lessonId);
    toast.success('Lesson marked as complete!');
    if (nextLesson) navigate(`/lesson/${courseId}/${nextLesson.id}`);
  };

  if (!course || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4">
        <BookOpen className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Lesson not found.</p>
        <Button asChild><Link to="/courses">Back to Catalog</Link></Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-0 -m-4 lg:-m-6">
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-background shrink-0">
        <Button variant="ghost" size="sm" asChild className="gap-1.5 text-muted-foreground">
          <Link to={`/course/${courseId}`}>
            <ChevronLeft className="h-4 w-4" /> {course.title}
          </Link>
        </Button>
        <div className="flex-1 mx-2 hidden sm:block">
          <div className="flex items-center gap-2">
            <Progress value={progress} className="h-1.5 flex-1 max-w-xs" />
            <span className="text-xs text-muted-foreground">{progress}% complete</span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => setSidebarOpen((p) => !p)}
          >
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto flex flex-col">
          <div className="bg-black p-0 sm:p-4 lg:p-6">
            <VideoPlayer poster={course.thumbnail} onEnded={handleMarkComplete} />
          </div>

          <div className="p-4 lg:p-6 space-y-6 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">{lesson.section}</Badge>
                  {lesson.completed && (
                    <Badge className="text-xs bg-success/10 text-success border-success/20">Completed</Badge>
                  )}
                </div>
                <h1 className="text-xl font-bold text-foreground">{lesson.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">Duration: {lesson.duration}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {prevLesson && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/lesson/${courseId}/${prevLesson.id}`)}
                    className="gap-1.5"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Prev
                  </Button>
                )}
                {!lesson.completed ? (
                  <Button size="sm" onClick={handleMarkComplete} className="gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5" /> Mark Complete
                  </Button>
                ) : nextLesson ? (
                  <Button size="sm" onClick={() => navigate(`/lesson/${courseId}/${nextLesson.id}`)} className="gap-1.5">
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                ) : null}
              </div>
            </div>

            <Separator />

            <Tabs defaultValue="notes">
              <TabsList className="h-9">
                <TabsTrigger value="notes" className="gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" /> Your Notes
                </TabsTrigger>
                <TabsTrigger value="transcript" className="gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Transcript
                </TabsTrigger>
              </TabsList>
              <TabsContent value="notes" className="mt-4">
                <Textarea
                  placeholder="Add your notes for this lesson... (auto-saved)"
                  value={notes[lessonId] ?? ''}
                  onChange={(e) => setNote(lessonId, e.target.value)}
                  className="min-h-[140px] resize-none bg-muted/30 border-border focus-visible:ring-primary text-sm"
                />
                {notes[lessonId] && (
                  <p className="text-xs text-muted-foreground mt-1.5">✓ Notes saved</p>
                )}
              </TabsContent>
              <TabsContent value="transcript" className="mt-4">
                <div className="space-y-3 text-sm text-muted-foreground bg-muted/20 rounded-lg p-4">
                  <p><span className="text-primary font-mono text-xs">0:00</span> — In this lesson, we'll explore the fundamentals of React components and how they work together to build user interfaces.</p>
                  <p><span className="text-primary font-mono text-xs">1:30</span> — A component in React is essentially a JavaScript function that returns JSX, which describes what should appear on screen.</p>
                  <p><span className="text-primary font-mono text-xs">3:45</span> — Components can receive data through props, which are passed from parent to child, similar to function arguments.</p>
                  <p><span className="text-primary font-mono text-xs">6:20</span> — State allows components to "remember" information between renders and trigger updates when that information changes.</p>
                  <p><span className="text-primary font-mono text-xs">9:00</span> — Let's look at some practical examples of how to create and compose components effectively.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {sidebarOpen && (
          <div className="w-72 xl:w-80 shrink-0 border-l border-border bg-card flex flex-col hidden md:flex">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-sm text-foreground">Course Content</h3>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={progress} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground shrink-0">{completedCount}/{allLessons.length}</span>
              </div>
            </div>
            <ScrollArea className="flex-1">
              {course.curriculum.map((section, si) => (
                <div key={si}>
                  <div className="px-4 py-2.5 bg-muted/30 sticky top-0">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{section.section}</p>
                  </div>
                  {section.lessons.map((l) => {
                    const TypeIcon = LESSON_ICON[l.type] || Video;
                    const isCurrent = l.id === lessonId;
                    return (
                      <button
                        key={l.id}
                        onClick={() => navigate(`/lesson/${courseId}/${l.id}`)}
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left text-sm transition-colors border-b border-border/50 last:border-0 ${
                          isCurrent ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-muted/30'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {l.completed ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : isCurrent ? (
                            <TypeIcon className="h-4 w-4 text-primary" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`leading-snug truncate ${
                            isCurrent ? 'text-primary font-medium' : l.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                          }`}>
                            {l.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{l.duration}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
