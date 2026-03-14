import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import CourseCatalog from '@/pages/CourseCatalog';
import CourseDetail from '@/pages/CourseDetail';
import VideoLesson from '@/pages/VideoLesson';
import Quiz from '@/pages/Quiz';
import MyLearning from '@/pages/MyLearning';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/lesson/:courseId/:lessonId" element={<VideoLesson />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
          <Route path="/my-learning" element={<MyLearning />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
