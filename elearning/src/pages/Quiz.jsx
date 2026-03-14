import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Clock, ChevronLeft, ChevronRight, CheckCircle, XCircle,
  Brain, Trophy, RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { QUIZ_DATA } from '@/data/mockData';
import useStore from '@/store/useStore';
import { toast } from 'sonner';

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Quiz() {
  const { quizId } = useParams();
  const { quizAnswers, setQuizAnswer, resetQuiz } = useStore();

  const quiz = QUIZ_DATA;
  const [currentQ, setCurrentQ] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit);

  const question = quiz.questions[currentQ];
  const selectedAnswer = quizAnswers[question?.id];
  const answeredCount = Object.keys(quizAnswers).length;

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    const correct = quiz.questions.filter((q) => quizAnswers[q.id] === q.correct).length;
    const score = Math.round((correct / quiz.questions.length) * 100);
    toast.success(`Quiz completed! Score: ${score}%`);
  }, [quiz.questions, quizAnswers]);

  useEffect(() => {
    if (submitted || timeLeft <= 0) {
      if (timeLeft <= 0 && !submitted) handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [submitted, timeLeft, handleSubmit]);

  const handleRestart = () => {
    resetQuiz();
    setCurrentQ(0);
    setSubmitted(false);
    setTimeLeft(quiz.timeLimit);
  };

  const goTo = (i) => setCurrentQ(i);

  if (submitted) {
    const correct = quiz.questions.filter((q) => quizAnswers[q.id] === q.correct).length;
    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= 70;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4 py-8">
          <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-5xl ${passed ? 'bg-success/10' : 'bg-destructive/10'}`}>
            {passed ? '🏆' : '📚'}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{passed ? 'Great Job!' : 'Keep Practicing!'}</h1>
            <p className="text-muted-foreground mt-1">{quiz.title}</p>
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <p className={`text-5xl font-bold ${passed ? 'text-success' : 'text-destructive'}`}>{score}%</p>
              <p className="text-sm text-muted-foreground mt-1">Score</p>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <p className="text-5xl font-bold text-foreground">{correct}/{quiz.questions.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Correct</p>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <p className="text-5xl font-bold text-foreground">{formatTime(quiz.timeLimit - timeLeft)}</p>
              <p className="text-sm text-muted-foreground mt-1">Time Used</p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={handleRestart} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Retake Quiz
            </Button>
            <Button asChild className="gap-2">
              <Link to="/my-learning"><Trophy className="h-4 w-4" /> View Progress</Link>
            </Button>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="section-title mb-4">Question Review</h2>
          <div className="space-y-4">
            {quiz.questions.map((q, i) => {
              const userAnswer = quizAnswers[q.id];
              const isCorrect = userAnswer === q.correct;
              return (
                <Card key={q.id} className={`border ${isCorrect ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      {isCorrect
                        ? <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                        : <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">Q{i + 1}. {q.question}</p>
                        <div className="mt-2 space-y-1">
                          {q.options.map((opt, oi) => (
                            <div
                              key={oi}
                              className={`text-xs px-3 py-1.5 rounded-md ${
                                oi === q.correct
                                  ? 'bg-success/15 text-success font-medium'
                                  : oi === userAnswer && !isCorrect
                                  ? 'bg-destructive/15 text-destructive'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {oi === q.correct && '✓ '}{opt}{oi === userAnswer && !isCorrect && ' ✗'}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 italic">💡 {q.explanation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Brain className="h-5 w-5 text-primary" />
            <h1 className="page-title">{quiz.title}</h1>
          </div>
          <p className="text-sm text-muted-foreground">Question {currentQ + 1} of {quiz.questions.length}</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-mono font-bold text-lg transition-colors ${
          timeLeft <= 60
            ? 'border-destructive bg-destructive/10 text-destructive'
            : timeLeft <= 180
            ? 'border-warning bg-warning/10 text-warning'
            : 'border-primary/30 bg-primary/5 text-primary'
        }`}>
          <Clock className="h-4 w-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="space-y-1.5">
        <Progress value={((currentQ + 1) / quiz.questions.length) * 100} className="h-2" />
        <div className="flex justify-between">
          <div className="flex gap-1.5">
            {quiz.questions.map((q, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-6 h-6 rounded-full text-[10px] font-bold transition-all border ${
                  i === currentQ
                    ? 'bg-primary text-primary-foreground border-primary scale-110'
                    : quizAnswers[q.id] !== undefined
                    ? 'bg-success/20 text-success border-success/40'
                    : 'bg-muted text-muted-foreground border-border hover:border-primary/40'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{answeredCount}/{quiz.questions.length} answered</span>
        </div>
      </div>

      <Card className="border border-border shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-1">
            <Badge className="text-xs bg-primary/10 text-primary border-0">Question {currentQ + 1}</Badge>
            <p className="text-lg font-semibold text-foreground leading-snug">{question.question}</p>
          </div>

          <RadioGroup
            value={selectedAnswer !== undefined ? selectedAnswer.toString() : ''}
            onValueChange={(val) => setQuizAnswer(question.id, parseInt(val))}
          >
            <div className="space-y-3">
              {question.options.map((opt, i) => (
                <Label
                  key={i}
                  htmlFor={`opt-${i}`}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all select-none ${
                    selectedAnswer === i
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/40 hover:bg-muted/30 text-foreground'
                  }`}
                >
                  <RadioGroupItem id={`opt-${i}`} value={i.toString()} className="shrink-0" />
                  <span className="text-sm font-medium">{opt}</span>
                </Label>
              ))}
            </div>
          </RadioGroup>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              disabled={currentQ === 0}
              onClick={() => goTo(currentQ - 1)}
              className="gap-1.5"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <div className="flex gap-2">
              {currentQ < quiz.questions.length - 1 ? (
                <Button
                  onClick={() => goTo(currentQ + 1)}
                  disabled={selectedAnswer === undefined}
                  className="gap-1.5"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="gap-1.5 bg-success hover:bg-success/90 text-success-foreground"
                  disabled={answeredCount < quiz.questions.length}
                >
                  <CheckCircle className="h-4 w-4" /> Submit Quiz
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {currentQ === quiz.questions.length - 1 && answeredCount < quiz.questions.length && (
        <p className="text-xs text-warning text-center">
          ⚠️ You have {quiz.questions.length - answeredCount} unanswered question(s). Answer all to submit.
        </p>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Click the numbered dots above to jump to any question
      </p>
    </div>
  );
}
