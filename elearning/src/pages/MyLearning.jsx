import { Link } from 'react-router-dom';
import {
  Trophy, Clock, BookOpen, Brain, Flame, Target,
  Download, Star, TrendingUp, Award, ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';
import useStore from '@/store/useStore';

const barConfig = {
  hours: { label: 'Hours Studied', color: 'var(--color-chart-1)' },
};

const radarData = [
  { subject: 'React', score: 78 },
  { subject: 'Python', score: 42 },
  { subject: 'Node.js', score: 55 },
  { subject: 'Design', score: 30 },
  { subject: 'ML/AI', score: 20 },
  { subject: 'Databases', score: 60 },
];

const goals = [
  { label: 'Daily goal', current: 1.5, target: 2, unit: 'hours' },
  { label: 'Weekly lessons', current: 8, target: 10, unit: 'lessons' },
  { label: 'Monthly quizzes', current: 3, target: 5, unit: 'quizzes' },
];

const recentQuizzes = [
  { title: 'React Fundamentals', score: 87, date: '2 days ago', passed: true },
  { title: 'Python Basics', score: 92, date: '1 week ago', passed: true },
  { title: 'CSS Advanced', score: 65, date: '2 weeks ago', passed: false },
];

const stats = [
  { label: 'Courses Enrolled', key: 'enrolledCourses', icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Total Hours', key: 'totalHours', icon: Clock, color: 'text-success', bg: 'bg-success/10', suffix: 'h' },
  { label: 'Quizzes Taken', key: 'quizzesTaken', icon: Brain, color: 'text-accent', bg: 'bg-accent/10' },
  { label: 'Streak', key: 'streak', icon: Flame, color: 'text-warning', bg: 'bg-warning/10', suffix: ' days 🔥' },
];

export default function MyLearning() {
  const { user, courses } = useStore();
  const enrolledCourses = courses.filter((c) => c.isEnrolled);
  const completedCourses = enrolledCourses.filter((c) => c.progress === 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="page-title">My Learning</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your progress, achievements, and certificates.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, key, icon: Icon, color, bg, suffix = '' }) => (
          <div key={label} className="stat-card">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{user[key]}{suffix}</p>
              <p className="label-xs mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="progress">
        <TabsList className="h-10 bg-muted/50">
          <TabsTrigger value="progress" className="gap-2"><TrendingUp className="h-3.5 w-3.5" />Progress</TabsTrigger>
          <TabsTrigger value="achievements" className="gap-2"><Trophy className="h-3.5 w-3.5" />Achievements</TabsTrigger>
          <TabsTrigger value="certificates" className="gap-2"><Award className="h-3.5 w-3.5" />Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <Card className="border border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="section-title">Weekly Study Hours</CardTitle>
                    <Badge variant="secondary" className="text-xs">{user.totalHours}h total</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={barConfig} className="h-[200px] w-full">
                    <BarChart data={user.weeklyActivity} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="hours" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="section-title">Skills Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ score: { label: 'Proficiency', color: 'var(--color-chart-4)' } }} className="h-[220px] w-full">
                    <RadarChart data={radarData} margin={{ top: 8, right: 20, bottom: 8, left: 20 }}>
                      <PolarGrid stroke="var(--color-border)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} />
                      <Radar dataKey="score" stroke="var(--color-chart-4)" fill="var(--color-chart-4)" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="section-title">Course Progress</CardTitle>
                    <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground">
                      <Link to="/courses">Browse More <ChevronRight className="h-3.5 w-3.5" /></Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {enrolledCourses.length === 0 ? (
                    <div className="text-center py-6">
                      <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">No courses enrolled yet.</p>
                      <Button asChild className="mt-3" size="sm">
                        <Link to="/courses">Browse Courses</Link>
                      </Button>
                    </div>
                  ) : (
                    enrolledCourses.map((course) => (
                      <div key={course.id}>
                        <div className="flex items-center gap-3 mb-2">
                          <img src={course.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">{course.title}</p>
                            <p className="text-xs text-muted-foreground">{course.instructor}</p>
                          </div>
                          <Badge
                            variant="secondary"
                            className={`text-xs shrink-0 ${course.progress === 100 ? 'bg-success/10 text-success' : ''}`}
                          >
                            {course.progress}%
                          </Badge>
                        </div>
                        <Progress value={course.progress} className="h-1.5" />
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">{course.lessons} lessons</span>
                          <Button variant="ghost" size="sm" asChild className="h-5 text-xs p-0 text-primary">
                            <Link to={`/course/${course.id}`}>Continue →</Link>
                          </Button>
                        </div>
                        <Separator className="mt-3" />
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="section-title flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" /> Learning Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {goals.map((g) => (
                    <div key={g.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-foreground">{g.label}</span>
                        <span className="text-muted-foreground font-medium">{g.current}/{g.target} {g.unit}</span>
                      </div>
                      <Progress value={(g.current / g.target) * 100} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="section-title">Recent Quizzes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentQuizzes.map((q, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        q.passed ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'
                      }`}>
                        {q.score}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{q.title}</p>
                        <p className="text-xs text-muted-foreground">{q.date}</p>
                      </div>
                      <Badge className={`text-[10px] border-0 ${q.passed ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                        {q.passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </div>
                  ))}
                  <Button asChild variant="outline" size="sm" className="w-full mt-1">
                    <Link to="/quiz/q1">Take a Quiz</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {user.achievements.map((a) => (
              <Card
                key={a.id}
                className={`border text-center p-5 transition-all ${
                  a.earned
                    ? 'border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 shadow-sm'
                    : 'border-border opacity-50 grayscale'
                }`}
              >
                <div className="text-4xl mb-3">{a.icon}</div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{a.title}</h3>
                <p className="text-xs text-muted-foreground">{a.description}</p>
                {a.earned && (
                  <Badge className="mt-3 bg-success/10 text-success border-0 text-[10px]">Earned ✓</Badge>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="mt-6">
          {completedCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Award className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No certificates yet</h3>
              <p className="text-muted-foreground text-sm mb-4">Complete a course to earn your certificate</p>
              <Button asChild><Link to="/courses">Browse Courses</Link></Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedCourses.map((course) => (
                <Card key={course.id} className="border border-border overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-primary via-accent to-success" />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Award className="h-8 w-8 text-warning" />
                      <Badge className="bg-success/10 text-success border-0 text-xs">Completed</Badge>
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mb-4">Instructor: {course.instructor}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex">
                        {[1,2,3,4,5].map((s) => <Star key={s} className="h-3 w-3 text-warning fill-current" />)}
                      </div>
                      <span className="text-xs text-muted-foreground">Certificate of Completion</span>
                    </div>
                    <Button className="w-full mt-4 gap-2" size="sm" variant="outline">
                      <Download className="h-3.5 w-3.5" /> Download PDF
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
