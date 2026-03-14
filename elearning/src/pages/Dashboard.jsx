import { Link } from 'react-router-dom';
import {
  BookOpen, Clock, Brain, Flame, ChevronRight,
  Play, CheckCircle, Award, ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import useStore from '@/store/useStore';
import CourseCard from '@/components/courses/CourseCard';
import { RECENT_ACTIVITY } from '@/data/mockData';

const chartConfig = {
  hours: { label: 'Hours', color: 'var(--color-chart-1)' },
};

const STAT_CARDS = [
  { label: 'Courses Enrolled', icon: BookOpen, key: 'enrolledCourses', color: 'bg-primary/10 text-primary' },
  { label: 'Total Hours', icon: Clock, key: 'totalHours', color: 'bg-success/10 text-success', suffix: 'h' },
  { label: 'Quizzes Taken', icon: Brain, key: 'quizzesTaken', color: 'bg-accent/10 text-accent' },
  { label: 'Learning Streak', icon: Flame, key: 'streak', color: 'bg-warning/10 text-warning', suffix: ' days' },
];

const activityIcon = {
  lesson: <Play className="h-3 w-3" />,
  quiz: <Brain className="h-3 w-3" />,
};

const activityColor = {
  lesson: 'bg-primary/10 text-primary',
  quiz: 'bg-accent/10 text-accent',
};

export default function Dashboard() {
  const { courses, user } = useStore();
  const enrolledCourses = courses.filter((c) => c.isEnrolled);
  const recommendedCourses = courses.filter((c) => !c.isEnrolled).slice(0, 4);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your learning progress and pick up where you left off.
          </p>
        </div>
        <Button asChild className="hidden sm:flex gap-2">
          <Link to="/courses">
            <BookOpen className="h-4 w-4" /> Browse Courses
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, icon: Icon, key, color, suffix = '' }) => (
          <div key={key} className="stat-card">
            <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
              <Icon className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground tracking-tight">
                {user[key]}{suffix}
              </p>
              <p className="label-xs mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="border border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="section-title">Weekly Progress</CardTitle>
                <Badge variant="secondary" className="text-xs">This Week</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ChartContainer config={chartConfig} className="h-[180px] w-full">
                <AreaChart data={user.weeklyActivity} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2.5}
                    fill="url(#hoursGradient)"
                    dot={{ fill: 'var(--color-chart-1)', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Continue Learning</h2>
              <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground">
                <Link to="/courses">View All <ChevronRight className="h-3.5 w-3.5" /></Link>
              </Button>
            </div>
            {enrolledCourses.length === 0 ? (
              <Card className="border-dashed border-2 border-border text-center p-10">
                <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">No courses enrolled yet.</p>
                <Button asChild className="mt-4" size="sm">
                  <Link to="/courses">Browse Courses</Link>
                </Button>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {enrolledCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Recommended for You</h2>
              <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground">
                <Link to="/courses">See All <ChevronRight className="h-3.5 w-3.5" /></Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {recommendedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border border-border bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background rounded-lg p-2.5 text-center">
                  <p className="text-xs text-muted-foreground">Streak</p>
                  <p className="font-bold text-foreground">{user.streak} 🔥</p>
                </div>
                <div className="bg-background rounded-lg p-2.5 text-center">
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="font-bold text-foreground">march  2026</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="section-title">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {RECENT_ACTIVITY.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${activityColor[item.type] ?? 'bg-success/10 text-success'}`}>
                    {activityIcon[item.type] ?? <CheckCircle className="h-3 w-3" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.course}</p>
                    {item.score && (
                      <Badge className="mt-1 text-[10px] bg-success/10 text-success border-0 px-1.5 py-0">
                        Score: {item.score}%
                      </Badge>
                    )}
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="section-title">Achievements</CardTitle>
                <Link to="/my-learning" className="text-xs text-primary hover:underline flex items-center gap-1">
                  View All <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-4 gap-2">
                {user.achievements.slice(0, 8).map((a) => (
                  <div
                    key={a.id}
                    title={`${a.title}: ${a.description}`}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center cursor-default transition-all ${a.earned ? 'opacity-100' : 'opacity-30 grayscale'}`}
                  >
                    <span className="text-xl">{a.icon}</span>
                    <span className="text-[9px] text-muted-foreground leading-tight">{a.title}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Play className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">Up Next</span>
              </div>
              <p className="font-semibold text-sm text-foreground mb-1">Props and State</p>
              <p className="text-xs text-muted-foreground mb-3">React Bootcamp · Lesson 4 · 22 min</p>
              <Button asChild size="sm" className="w-full gap-2">
                <Link to="/lesson/1/l4">
                  <Play className="h-3.5 w-3.5" /> Continue Learning
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
