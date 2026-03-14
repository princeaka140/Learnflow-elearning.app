import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { COURSES, USER_PROFILE } from '../data/mockData';

const useStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      },

      user: USER_PROFILE,

      courses: COURSES,
      enrollCourse: (courseId) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === courseId ? { ...c, isEnrolled: true, progress: 0 } : c
          ),
        })),

      currentLessonId: 'l4',
      setCurrentLesson: (id) => set({ currentLessonId: id }),

      markLessonComplete: (courseId, lessonId) =>
        set((state) => ({
          courses: state.courses.map((c) => {
            if (c.id !== courseId) return c;
            const updatedCurriculum = c.curriculum.map((section) => ({
              ...section,
              lessons: section.lessons.map((l) =>
                l.id === lessonId ? { ...l, completed: true } : l
              ),
            }));
            const totalLessons = updatedCurriculum.reduce((acc, s) => acc + s.lessons.length, 0);
            const completedLessons = updatedCurriculum.reduce(
              (acc, s) => acc + s.lessons.filter((l) => l.completed).length,
              0
            );
            return {
              ...c,
              curriculum: updatedCurriculum,
              progress: Math.round((completedLessons / totalLessons) * 100),
            };
          }),
        })),

      notes: {},
      setNote: (lessonId, text) =>
        set((state) => ({ notes: { ...state.notes, [lessonId]: text } })),

      quizAnswers: {},
      setQuizAnswer: (questionId, answerIndex) =>
        set((state) => ({
          quizAnswers: { ...state.quizAnswers, [questionId]: answerIndex },
        })),
      resetQuiz: () => set({ quizAnswers: {} }),
    }),
    {
      name: 'learnflow-storage',
      partialize: (state) => ({
        theme: state.theme,
        notes: state.notes,
        courses: state.courses,
        currentLessonId: state.currentLessonId,
      }),
    }
  )
);

export default useStore;
