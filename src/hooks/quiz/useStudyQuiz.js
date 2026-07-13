import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { fetchQuizAnswers, fetchQuizQuestions } from "@/api/quiz";

const OPTION_KEYS = ["A", "B", "C", "D"];

function optionText(question, optionKey) {
  return question?.[`option${optionKey}`] ?? "";
}

export function useStudyQuiz(quizId) {
  const [questionsQuery, answersQuery] = useQueries({
    queries: [
      {
        queryKey: ["quizzes", quizId, "questions"],
        queryFn: () => fetchQuizQuestions(quizId),
        enabled: Boolean(quizId),
      },
      {
        queryKey: ["quizzes", quizId, "answers"],
        queryFn: () => fetchQuizAnswers(quizId),
        enabled: Boolean(quizId),
      },
    ],
  });

  const studyQuestions = useMemo(() => {
    const questions = questionsQuery.data ?? [];
    const answers = answersQuery.data ?? [];

    const answersByQuestionId = new Map(
      answers.map((answer) => [answer.questionId, answer.correctAnswer]),
    );

    return questions.map((question, index) => {
      const correctAnswer = answersByQuestionId.get(question.id);

      return {
        ...question,
        displayNumber: question.questionOrder ?? index + 1,
        correctAnswer,
        correctOptionText: correctAnswer
          ? optionText(question, correctAnswer)
          : "",
        options: OPTION_KEYS.map((key) => ({
          key,
          label: key,
          content: optionText(question, key),
          isCorrect: key === correctAnswer,
        })),
      };
    });
  }, [answersQuery.data, questionsQuery.data]);

  return {
    questions: studyQuestions,
    isLoading: questionsQuery.isLoading || answersQuery.isLoading,
    isError: questionsQuery.isError || answersQuery.isError,
    error: questionsQuery.error || answersQuery.error,
  };
}
