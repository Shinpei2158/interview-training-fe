import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMyQuizzes,
  deleteQuiz,
  saveDraftQuiz,
  submitQuiz,
  saveQuestions,
  uploadQuestionImage,
  fetchQuizQuestions,
  createQuiz,
  fetchQuizDetail,
  fetchQuizAnswers,
} from "@/api/quiz";
import { useToast } from "@/context/ToastContext";

export function useMyQuizzes() {
  return useQuery({
    queryKey: ["my-quizzes"],
    queryFn: async () => {
      const response = await fetchMyQuizzes();
      return response.data || response;
    },
  });
}

export function useQuizAnswers(quizId) {
  return useQuery({
    queryKey: ["quiz-answers-admin", quizId],
    queryFn: async () => {
      const response = await fetchQuizAnswers(quizId);
      return response.data || response;
    },
    enabled: !!quizId,
  });
}

export function useQuizDetail(quizId) {
  return useQuery({
    queryKey: ["quiz-detail", quizId],
    queryFn: async () => {
      const response = await fetchQuizDetail(quizId);
      return response.data || response;
    },
    enabled: !!quizId,
  });
}

export function useQuizQuestions(quizId) {
  return useQuery({
    queryKey: ["quiz-questions", quizId],
    queryFn: async () => {
      const response = await fetchQuizQuestions(quizId);
      return response.data || response;
    },
    enabled: !!quizId,
  });
}

export function useCreateQuiz() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await createQuiz(payload);
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-quizzes"] });
      toast.success("Tạo bộ câu hỏi thành công");
    },
    onError: (error) => {
      toast.error(error?.message || "Tạo bộ câu hỏi thất bại");
    },
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (quizId) => {
      const response = await deleteQuiz(quizId);
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["my-private-quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["saved-questions"] });
      toast.success("Đã xóa bộ câu hỏi thành công!");
    },
    onError: (error) => {
      toast.error(error?.message || "Không thể xóa bộ câu hỏi");
    },
  });
}

export function useSaveDraftQuiz() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ quizId, payload }) => {
      const response = await saveDraftQuiz(quizId, payload);
      return response.data || response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["quiz-questions", data.id] });
    },
    onError: (error) => {
      toast.error(error?.message || "Lưu nháp bộ câu hỏi thất bại");
    },
  });
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (quizId) => {
      const response = await submitQuiz(quizId);
      return response.data || response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["quiz-questions", data.id] });
      toast.success("Đã gửi yêu cầu phê duyệt bộ câu hỏi");
    },
    onError: (error) => {
      toast.error(error?.message || "Gửi yêu cầu phê duyệt bộ câu hỏi thất bại");
    },
  });
}

export function useSaveQuestions(quizId) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (questions) => {
      const response = await saveQuestions(quizId, questions);
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-questions", quizId] });
    },
    onError: (error) => {
      toast.error(error?.message || "Lưu câu hỏi thất bại");
    },
  });
}

export function useUploadQuestionImage() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ questionId, file }) => {
      const response = await uploadQuestionImage(questionId, file);
      return response.data || response;
    },
    onError: (error) => {
      toast.error(error?.message || "Tải lên hình ảnh thất bại");
    },
  });
}
