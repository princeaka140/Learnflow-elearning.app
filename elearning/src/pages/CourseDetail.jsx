import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, Clock, BookOpen, Users, Play, CheckCircle,
  ChevronLeft, Lock, Video, Brain, FileText, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import useStore from '@/store/useStore';
import { toast } from 'sonner';

const LESSON_TYPE_ICON = {
  video: Video,
  quiz: Brain,
  reading: FileText,
};

const LEVEL_COLORS = {
  Beginner: 'bg-success/10 text-success border-success/20',
  Intermediate: 'bg-warning/10 text-warning border-warning/20',
  Advanced: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, enrollCourse } = useStore();
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4">
        <BookOpen className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Course not found.</p>
        <Button asChild><Link to="/courses">Back to Catalog</Link></Button>
      </div>
    );
  }

  const totalLessons = course.curriculum.reduce((acc, s) => acc + s.lessons.length, 0);
  const completedLessons = course.curriculum.reduce(
    (acc, s) => acc + s.lessons.filter((l) => l.completed).length, 0
  );

  const handleEnroll = () => {
    enrollCourse(course.id);
    toast.success(`Enrolled in "${course.title}"!`, { description: 'Start learning now.' });
  };

  const handleContinue = () => {
    const firstIncomplete = course.curriculum.flatMap((s) => s.lessons).find((l) => !l.completed);
    if (firstIncomplete) navigate(`/lesson/${course.id}/${firstIncomplete.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 text-muted-foreground">
        <Link to="/courses"><ChevronLeft className="h-4 w-4" /> Back to Catalog</Link>
      </Button>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-xl overflow-hidden relative aspect-video shadow-sm">
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${LEVEL_COLORS[course.level]} border text-xs`}>{course.level}</Badge>
                <Badge variant="secondary" className="text-xs">{course.category}</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">{course.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-white/80 text-sm">
                <span className="flex items-center gap-1 text-warning font-semibold">
                  <Star className="h-4 w-4 fill-current" />{course.rating}
                  <span className="text-white/60 font-normal">({course.reviewCount.toLocaleString()})</span>
                </span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{course.enrolled.toLocaleString()} enrolled</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</span>
                <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{course.lessons} lessons</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="h-10 bg-muted/50">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-4">
              <div>
                <h2 className="section-title mb-2">About This Course</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{course.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm">What you'll learn</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {course.tags.map((tag) => (
                    <div key={tag} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success shrink-0" />
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Duration', value: course.duration, icon: Clock },
                  { label: 'Lessons', value: course.lessons, icon: BookOpen },
                  { label: 'Level', value: course.level, icon: Award },
                  { label: 'Students', value: course.enrolled.toLocaleString(), icon: Users },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="text-center p-3 rounded-lg bg-muted/40">
                    <Icon className="h-4 w-4 text-primary mx-auto mb-1" />
                    <p className="font-semibold text-foreground text-sm">{value}</p>
                    <p className="label-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="curriculum" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title">Course Curriculum</h2>
                <span className="text-sm text-muted-foreground">{totalLessons} lessons · {course.duration}</span>
              </div>
              {course.curriculum.length === 0 ? (
                <p className="text-muted-foreground text-sm">Curriculum coming soon.</p>
              ) : (
                <Accordion type="multiple" defaultValue={['section-0']} className="space-y-2">
                  {course.curriculum.map((section, si) => (
                    <AccordionItem key={si} value={`section-${si}`} className="border border-border rounded-lg overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <span className="font-semibold text-sm">{section.section}</span>
                          <Badge variant="secondary" className="text-xs">{section.lessons.length} lessons</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-0">
                        <div className="divide-y divide-border">
                          {section.lessons.map((lesson) => {
                            const TypeIcon = LESSON_TYPE_ICON[lesson.type] || Video;
                            const canAccess = course.isEnrolled || si === 0;
                            return (
                              <div
                                key={lesson.id}
                                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                                  canAccess ? 'hover:bg-muted/30 cursor-pointer' : 'opacity-60'
                                } ${lesson.completed ? 'text-muted-foreground' : 'text-foreground'}`}
                                onClick={() => canAccess && course.isEnrolled && lesson.type !== 'quiz'
                                  ? null : undefined}
                              >
                                {lesson.completed ? (
                                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                                ) : canAccess ? (
                                  <TypeIcon className="h-4 w-4 text-primary shrink-0" />
                                ) : (
                                  <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                                )}
                                <span className={`flex-1 ${lesson.completed ? 'line-through' : ''}`}>
                                  {lesson.title}
                                </span>
                                <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                                {lesson.type === 'quiz' && course.isEnrolled && (
                                  <Button size="sm" variant="ghost" asChild className="h-6 px-2 text-xs">
                                    <Link to={`/quiz/q1`}>Take Quiz</Link>
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </TabsContent>

            <TabsContent value="instructor" className="mt-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={course.instructorAvatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                    {course.instructor[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-bold text-lg text-foreground">{course.instructor}</h2>
                  <p className="text-muted-foreground text-sm">Senior Instructor · {course.category}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 text-warning"><Star className="h-3.5 w-3.5 fill-current" />{course.rating} Rating</span>
                    <span><Users className="h-3.5 w-3.5 inline mr-1" />{course.enrolled.toLocaleString()} Students</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    An experienced {course.category} professional with over 10 years in the industry. 
                    Passionate about teaching and helping developers level up their skills through practical, 
                    project-based learning.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 space-y-4">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-foreground">{course.rating}</p>
                  <div className="flex items-center gap-0.5 mt-1 justify-center">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={`h-4 w-4 ${s <= Math.round(course.rating) ? 'text-warning fill-current' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Course Rating</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5,4,3,2,1].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <Progress value={s === 5 ? 72 : s === 4 ? 18 : s === 3 ? 6 : 3} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground w-4">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              {[
                { name: 'Jordan Lee', rating: 5, comment: 'Absolutely incredible course! The content is well-structured and the instructor explains everything clearly.', date: '2 weeks ago', avatar: 'https://i.pravatar.cc/32?u=jordan' },
                { name: 'Maria Santos', rating: 4, comment: 'Great course overall. I especially loved the hands-on projects. Would love more advanced topics.', date: '1 month ago', avatar: 'https://i.pravatar.cc/32?u=maria' },
                { name: 'Tom Baker', rating: 5, comment: 'Best course on this topic I\'ve found. Very practical and up to date with the latest features.', date: '1 month ago', avatar: 'https://i.pravatar.cc/32?u=tom' },
              ].map((r, i) => (
                <div key={i} className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={r.avatar} />
                    <AvatarFallback>{r.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{r.name}</span>
                      <div className="flex">
                        {[1,2,3,4,5].map((s) => <Star key={s} className={`h-3 w-3 ${s <= r.rating ? 'text-warning fill-current' : 'text-muted-foreground'}`} />)}
                      </div>
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        <div className="xl:sticky xl:top-20 xl:self-start space-y-4">
          <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-4">
            {!course.isEnrolled && (
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-foreground">${course.price}</span>
              </div>
            )}

            {course.isEnrolled && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your Progress</span>
                  <span className="font-semibold text-primary">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {completedLessons} of {totalLessons} lessons completed
                </p>
              </div>
            )}

            {course.isEnrolled ? (
              <Button className="w-full gap-2" onClick={handleContinue}>
                <Play className="h-4 w-4" /> Continue Learning
              </Button>
            ) : (
              <Button className="w-full gap-2" onClick={handleEnroll}>
                Enroll Now — ${course.price}
              </Button>
            )}

            <Separator />

            <div className="space-y-2.5 text-sm">
              {[
                { label: 'Duration', value: course.duration, icon: Clock },
                { label: 'Lessons', value: `${course.lessons} lessons`, icon: BookOpen },
                { label: 'Level', value: course.level, icon: Award },
                { label: 'Students', value: course.enrolled.toLocaleString(), icon: Users },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{label}:</span>
                  <span className="font-medium text-foreground ml-auto">{value}</span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex flex-wrap gap-1.5">
              {course.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
