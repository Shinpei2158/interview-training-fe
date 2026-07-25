import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useQuizDetail,
  useQuizQuestions,
  useQuizAnswers,
  useSaveDraftQuiz,
  useSubmitQuiz,
  useSaveQuestions,
  useUploadQuestionImage,
} from "@/hooks/quiz/useInterviewerQuiz";
import { useCategoryBrowse } from "@/hooks/useCategoryBrowse";
import { useToast } from "@/context/ToastContext";
import PageHeader from "@/components/common/PageHeader";
import MarkdownContent from "@/components/MarkdownContent";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Send,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  X,
  Loader2,
  Bold,
  Italic,
  Underline,
  Code,
  Heading2,
  List,
  ListOrdered,
  Eye,
  Settings,
  HelpCircle,
} from "lucide-react";

const LEVEL_OPTIONS = [
  { value: "INTERN", label: "Intern" },
  { value: "FRESHER", label: "Fresher" },
  { value: "JUNIOR", label: "Junior" },
  { value: "MIDDLE", label: "Middle" },
  { value: "SENIOR", label: "Senior" },
];

function flattenSubcategories(categories = []) {
  return categories.flatMap((category) =>
    (category.subCategories || []).map((subCategory) => ({
      ...subCategory,
      categoryId: category.id,
      categoryName: category.name,
    })),
  );
}

export default function InterviewerQuizEditorPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load backend data
  const { data: quiz, isLoading: isQuizLoading } = useQuizDetail(quizId);
  const { data: questions = [], isLoading: isQuestionsLoading } =
    useQuizQuestions(quizId);
  const { data: answers = [], isLoading: isAnswersLoading } =
    useQuizAnswers(quizId);
  const { data: categories = [] } = useCategoryBrowse();

  // Mutations
  const saveDraftMutation = useSaveDraftQuiz();
  const submitQuizMutation = useSubmitQuiz();
  const saveQuestionsMutation = useSaveQuestions(quizId);
  const uploadImageMutation = useUploadQuestionImage();

  // Local Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSubIds, setSelectedSubIds] = useState([]);
  const [questionsList, setQuestionsList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Markdown live preview toggles for each question card
  const [previewToggles, setPreviewToggles] = useState({});

  // Refs for textareas to handle selection-based markdown insertion
  const textareaRefs = useRef({});

  // Flattened list of all subcategories with parent category details
  const allSubcategories = useMemo(
    () => flattenSubcategories(categories),
    [categories],
  );

  // Determine active parent category ID to enforce same-category rule
  const lockedCategoryId = useMemo(() => {
    if (selectedSubIds.length === 0) return null;
    const firstSub = allSubcategories.find(
      (sub) => sub.id === selectedSubIds[0],
    );
    return firstSub ? firstSub.categoryId : null;
  }, [selectedSubIds, allSubcategories]);

  // Populate local states when backend data is loaded
  useEffect(() => {
    if (quiz) {
      setTitle(quiz.title || "");
      setDescription(quiz.description || "");
      setSelectedSubIds(quiz.subCategories?.map((sub) => sub.id) || []);
    }
  }, [quiz]);

  useEffect(() => {
    if (questions.length > 0 && answers.length > 0) {
      const answersMap = new Map(
        answers.map((ans) => [ans.questionId, ans.correctAnswer]),
      );
      const mapped = questions.map((q, idx) => ({
        id: q.id,
        content: q.content || "",
        contentImageUrl: q.contentImageUrl || "",
        optionA: q.optionA || "",
        optionB: q.optionB || "",
        optionC: q.optionC || "",
        optionD: q.optionD || "",
        correctAnswer: answersMap.get(q.id) || "A",
        level: q.level || "INTERN",
        questionOrder: q.questionOrder || idx + 1,
        pendingImage: null,
        pendingPreviewUrl: null,
        _deleted: false,
      }));
      setQuestionsList(mapped);
    } else if (
      questions.length > 0 &&
      !isAnswersLoading &&
      answers.length === 0
    ) {
      // Fallback if questions exist but answers fail to load
      const mapped = questions.map((q, idx) => ({
        id: q.id,
        content: q.content || "",
        contentImageUrl: q.contentImageUrl || "",
        optionA: q.optionA || "",
        optionB: q.optionB || "",
        optionC: q.optionC || "",
        optionD: q.optionD || "",
        correctAnswer: "A",
        level: q.level || "INTERN",
        questionOrder: q.questionOrder || idx + 1,
        pendingImage: null,
        pendingPreviewUrl: null,
        _deleted: false,
      }));
      setQuestionsList(mapped);
    }
  }, [questions, answers, isAnswersLoading]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      questionsList.forEach((q) => {
        if (q.pendingPreviewUrl) URL.revokeObjectURL(q.pendingPreviewUrl);
      });
    };
  }, [questionsList]);

  const handleToggleSubcategory = (sub) => {
    const isSelected = selectedSubIds.includes(sub.id);
    if (isSelected) {
      setSelectedSubIds((prev) => prev.filter((id) => id !== sub.id));
    } else {
      if (selectedSubIds.length >= 3) {
        toast.error("Bạn chỉ được chọn tối đa 3 danh mục con");
        return;
      }
      if (lockedCategoryId && sub.categoryId !== lockedCategoryId) {
        toast.error(
          "Tất cả các danh mục con được chọn phải thuộc về cùng một danh mục cha",
        );
        return;
      }
      setSelectedSubIds((prev) => [...prev, sub.id]);
    }
  };

  const handleAddQuestion = () => {
    const newOrder = questionsList.filter((q) => !q._deleted).length + 1;
    setQuestionsList((prev) => [
      ...prev,
      {
        id: null,
        content: "",
        contentImageUrl: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "A",
        level: "INTERN",
        questionOrder: newOrder,
        pendingImage: null,
        pendingPreviewUrl: null,
        _deleted: false,
      },
    ]);
  };

  const handleDeleteQuestion = (index) => {
    setQuestionsList((prev) =>
      prev.map((q, i) => {
        if (i === index) {
          return { ...q, _deleted: true };
        }
        return q;
      }),
    );
  };

  const handleMoveQuestion = (index, direction) => {
    const activeQuestions = questionsList
      .map((q, i) => ({ ...q, originalIndex: i }))
      .filter((q) => !q._deleted);
    const activeIdx = activeQuestions.findIndex(
      (q) => q.originalIndex === index,
    );

    if (direction === "up" && activeIdx > 0) {
      const targetActiveIdx = activeIdx - 1;
      const originalIdxA = activeQuestions[activeIdx].originalIndex;
      const originalIdxB = activeQuestions[targetActiveIdx].originalIndex;

      setQuestionsList((prev) => {
        const next = [...prev];
        const temp = next[originalIdxA];
        next[originalIdxA] = next[originalIdxB];
        next[originalIdxB] = temp;
        return next;
      });
    } else if (direction === "down" && activeIdx < activeQuestions.length - 1) {
      const targetActiveIdx = activeIdx + 1;
      const originalIdxA = activeQuestions[activeIdx].originalIndex;
      const originalIdxB = activeQuestions[targetActiveIdx].originalIndex;

      setQuestionsList((prev) => {
        const next = [...prev];
        const temp = next[originalIdxA];
        next[originalIdxA] = next[originalIdxB];
        next[originalIdxB] = temp;
        return next;
      });
    }
  };

  const handleQuestionFieldChange = (index, field, value) => {
    setQuestionsList((prev) =>
      prev.map((q, i) => {
        if (i === index) {
          return { ...q, [field]: value };
        }
        return q;
      }),
    );
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng tải lên một tệp hình ảnh");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setQuestionsList((prev) =>
      prev.map((q, i) => {
        if (i === index) {
          if (q.pendingPreviewUrl) URL.revokeObjectURL(q.pendingPreviewUrl);
          return {
            ...q,
            pendingImage: file,
            pendingPreviewUrl: previewUrl,
            contentImageUrl: "", // Overwrite existing URL
          };
        }
        return q;
      }),
    );
  };

  const handleRemoveImage = (index) => {
    setQuestionsList((prev) =>
      prev.map((q, i) => {
        if (i === index) {
          if (q.pendingPreviewUrl) URL.revokeObjectURL(q.pendingPreviewUrl);
          return {
            ...q,
            pendingImage: null,
            pendingPreviewUrl: null,
            contentImageUrl: "",
          };
        }
        return q;
      }),
    );
  };

  const applyMarkdown = (index, tag) => {
    const textarea = textareaRefs.current[index];
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    let replacement = "";
    switch (tag) {
      case "bold":
        replacement = `**${selected}**`;
        break;
      case "italic":
        replacement = `*${selected}*`;
        break;
      case "underline":
        replacement = `<u>${selected}</u>`;
        break;
      case "code":
        replacement = `\`${selected}\``;
        break;
      case "h2":
        replacement = `\n## ${selected}`;
        break;
      case "bullet":
        replacement = `\n- ${selected}`;
        break;
      case "number":
        replacement = `\n1. ${selected}`;
        break;
      default:
        replacement = selected;
    }

    const newContent =
      text.substring(0, start) + replacement + text.substring(end);
    handleQuestionFieldChange(index, "content", newContent);

    setTimeout(() => {
      textarea.focus();
      const offset = replacement.length - selected.length;
      textarea.setSelectionRange(start, end + offset);
    }, 0);
  };

  const handleSave = async (submitAfterSave = false) => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên bộ câu hỏi");
      return;
    }

    if (selectedSubIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một danh mục con");
      return;
    }

    const activeQuestions = questionsList.filter((q) => !q._deleted);
    if (activeQuestions.length === 0) {
      toast.error("Vui lòng thêm ít nhất một câu hỏi vào bộ đề");
      return;
    }

    // Validate questions fields
    for (let idx = 0; idx < activeQuestions.length; idx++) {
      const q = activeQuestions[idx];
      if (!q.content.trim()) {
        toast.error(`Nội dung câu hỏi #${idx + 1} không được để trống`);
        return;
      }
      if (
        !q.optionA.trim() ||
        !q.optionB.trim() ||
        !q.optionC.trim() ||
        !q.optionD.trim()
      ) {
        toast.error(`Các lựa chọn A, B, C, D của câu hỏi #${idx + 1} đều là bắt buộc`);
        return;
      }
    }

    setIsSaving(true);
    try {
      // Step 1: Save draft metadata
      await saveDraftMutation.mutateAsync({
        quizId,
        payload: {
          title: title.trim(),
          description: description.trim(),
          subCategoryIds: selectedSubIds,
        },
      });

      // Step 2: Save all questions
      const questionsPayload = activeQuestions.map((q, idx) => ({
        id: q.id || null,
        content: q.content.trim(),
        contentImageUrl: q.contentImageUrl || "",
        optionA: q.optionA.trim(),
        optionB: q.optionB.trim(),
        optionC: q.optionC.trim(),
        optionD: q.optionD.trim(),
        correctAnswer: q.correctAnswer,
        level: q.level,
        questionOrder: idx + 1,
      }));

      const savedResult =
        await saveQuestionsMutation.mutateAsync(questionsPayload);

      // Step 3: Loop upload images for any questions with pending local images
      for (const savedQuestion of savedResult) {
        const localIndex = savedQuestion.questionOrder - 1;
        const localQ = activeQuestions[localIndex];
        if (localQ && localQ.pendingImage) {
          await uploadImageMutation.mutateAsync({
            questionId: savedQuestion.id,
            file: localQ.pendingImage,
          });
        }
      }

      // Step 4: Submit for review if requested
      if (submitAfterSave) {
        await submitQuizMutation.mutateAsync(quizId);
      } else {
        toast.success("Đã lưu nháp bộ câu hỏi thành công!");
        navigate("/interviewer/quiz");
      }
    } catch (err) {
      // Error is handled by mutations
    } finally {
      setIsSaving(false);
    }
  };

  const isReadOnly = quiz?.status === "PENDING";
  const isLoading = isQuizLoading || isQuestionsLoading || isAnswersLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="animate-spin text-[#0077b6]" size={36} />
        <p className="text-sm text-slate-400 font-medium">
          Đang tải nội dung bộ câu hỏi...
        </p>
      </div>
    );
  }

  const activeQuestions = questionsList.filter((q) => !q._deleted);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Navigation & Action Header */}
      <PageHeader
        backUrl="/interviewer/quiz"
        badge="Dành cho Interviewer"
        title={isReadOnly ? "Xem Chi Tiết Bộ Câu Hỏi" : "Chỉnh Sửa Bộ Câu Hỏi"}
        description={
          isReadOnly
            ? "Bộ câu hỏi đang trong quá trình chờ quản trị viên duyệt và không thể chỉnh sửa."
            : "Cập nhật các câu hỏi, danh mục và chi tiết định dạng."
        }
      >
        {!isReadOnly && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Save size={16} />
              Lưu bản nháp
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0077b6] hover:bg-[#0096c7] text-white text-sm font-semibold rounded-xl transition shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Send size={16} />
              Hoàn tất & Gửi duyệt
            </button>
          </div>
        )}
      </PageHeader>

      {/* Quiz metadata & Subcategory Settings Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Settings size={16} className="text-[#0077b6]" />
          Cấu Hình Bộ Câu Hỏi
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Details */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Tên Bộ Câu Hỏi
              </label>
              <input
                type="text"
                disabled={isReadOnly}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Quiz Title"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-400 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Description
              </label>
              <textarea
                rows={3}
                disabled={isReadOnly}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-400 transition resize-none"
              />
            </div>
          </div>

          {/* Right Subcategory Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Selected Subcategories
              </label>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                {selectedSubIds.length}/3 tags selected
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Selected categories lock technology scope. Choose up to 3
              subcategories from the same main category.
            </p>

            <div className="border border-slate-100 rounded-xl max-h-[175px] overflow-y-auto p-4 bg-slate-50/50 space-y-4">
              {categories.map((category) => {
                const isSelectable =
                  !lockedCategoryId || category.id === lockedCategoryId;
                return (
                  <div
                    key={category.id}
                    className={`space-y-2 transition-opacity ${!isSelectable && !isReadOnly ? "opacity-35" : ""}`}
                  >
                    <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider block">
                      {category.name}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(category.subCategories || []).map((sub) => {
                        const isSelected = selectedSubIds.includes(sub.id);
                        return (
                          <button
                            type="button"
                            key={sub.id}
                            disabled={
                              isReadOnly || (!isSelected && !isSelectable)
                            }
                            onClick={() =>
                              handleToggleSubcategory({
                                ...sub,
                                categoryId: category.id,
                              })
                            }
                            className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-semibold transition ${
                              isSelected
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                            }`}
                          >
                            {sub.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Questions Editor Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={18} className="text-indigo-500" />
          Questions List ({activeQuestions.length})
        </h3>
        {!isReadOnly && (
          <button
            onClick={handleAddQuestion}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-indigo-200 hover:bg-indigo-50 text-indigo-600 text-xs font-bold rounded-xl transition shadow-sm active:scale-95 bg-white"
          >
            <Plus size={14} />
            Add Question
          </button>
        )}
      </div>

      {/* Questions Stack */}
      <div className="space-y-6">
        {questionsList.map((q, idx) => {
          if (q._deleted) return null;

          // Render active index starting from 1
          const activeIndex =
            questionsList.slice(0, idx).filter((item) => !item._deleted)
              .length + 1;
          const isPreviewMode = previewToggles[idx] || false;

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 hover:border-slate-200/80 transition duration-150 relative"
            >
              {/* Question Header: Number, Order Swapping & Actions */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                    {activeIndex}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    Question #{activeIndex}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Reordering Controls */}
                  {!isReadOnly && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleMoveQuestion(idx, "up")}
                        className="p-1.5 border border-slate-100 hover:border-slate-200 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition active:scale-90"
                        title="Move Up"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveQuestion(idx, "down")}
                        className="p-1.5 border border-slate-100 hover:border-slate-200 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition active:scale-90"
                        title="Move Down"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </>
                  )}

                  {/* Preview Toggle */}
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewToggles((prev) => ({
                        ...prev,
                        [idx]: !isPreviewMode,
                      }))
                    }
                    className={`p-1.5 border rounded-lg text-xs font-bold transition flex items-center gap-1 active:scale-90 ${
                      isPreviewMode
                        ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                        : "bg-white text-slate-400 border-slate-100 hover:border-slate-200 hover:text-slate-600"
                    }`}
                  >
                    <Eye size={13} />
                    {isPreviewMode ? "Editing" : "Preview"}
                  </button>

                  {/* Soft Delete */}
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(idx)}
                      className="p-1.5 border border-slate-100 hover:border-red-100 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition active:scale-90"
                      title="Remove Question"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Question Body */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left: Content Textarea & Options */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Markdown Editor / Preview Box */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">
                        Question Content (Markdown support)
                      </label>
                      {!isReadOnly && !isPreviewMode && (
                        /* Selection-based Markdown Toolbar */
                        <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-200 rounded-lg">
                          <button
                            type="button"
                            onClick={() => applyMarkdown(idx, "bold")}
                            className="p-1 rounded hover:bg-slate-200 text-slate-600 transition"
                            title="Bold"
                          >
                            <Bold size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => applyMarkdown(idx, "italic")}
                            className="p-1 rounded hover:bg-slate-200 text-slate-600 transition"
                            title="Italic"
                          >
                            <Italic size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => applyMarkdown(idx, "underline")}
                            className="p-1 rounded hover:bg-slate-200 text-slate-600 transition"
                            title="Underline"
                          >
                            <Underline size={12} />
                          </button>
                          <div className="w-px h-3 bg-slate-200 mx-0.5"></div>
                          <button
                            type="button"
                            onClick={() => applyMarkdown(idx, "code")}
                            className="p-1 rounded hover:bg-slate-200 text-slate-600 transition"
                            title="Code Block"
                          >
                            <Code size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => applyMarkdown(idx, "h2")}
                            className="p-1 rounded hover:bg-slate-200 text-slate-600 transition"
                            title="H2 Header"
                          >
                            <Heading2 size={12} />
                          </button>
                          <div className="w-px h-3 bg-slate-200 mx-0.5"></div>
                          <button
                            type="button"
                            onClick={() => applyMarkdown(idx, "bullet")}
                            className="p-1 rounded hover:bg-slate-200 text-slate-600 transition"
                            title="Bulleted List"
                          >
                            <List size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => applyMarkdown(idx, "number")}
                            className="p-1 rounded hover:bg-slate-200 text-slate-600 transition"
                            title="Numbered List"
                          >
                            <ListOrdered size={12} />
                          </button>
                        </div>
                      )}
                    </div>

                    {isPreviewMode ? (
                      <div className="w-full min-h-[100px] border border-slate-100 bg-slate-50/50 rounded-xl p-4 text-sm text-slate-800 leading-relaxed max-h-[250px] overflow-y-auto">
                        {q.content.trim() ? (
                          <MarkdownContent>{q.content}</MarkdownContent>
                        ) : (
                          <span className="text-slate-400 italic text-xs">
                            No content provided yet.
                          </span>
                        )}
                      </div>
                    ) : (
                      <textarea
                        rows={4}
                        disabled={isReadOnly}
                        ref={(el) => (textareaRefs.current[idx] = el)}
                        value={q.content}
                        onChange={(e) =>
                          handleQuestionFieldChange(
                            idx,
                            "content",
                            e.target.value,
                          )
                        }
                        placeholder="Write question content here..."
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-400 transition font-sans resize-none"
                      />
                    )}
                  </div>

                  {/* Options Input A, B, C, D */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["A", "B", "C", "D"].map((opt) => (
                      <div key={opt} className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-600 flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center font-bold">
                            {opt}
                          </span>
                          Option {opt}
                        </label>
                        <input
                          type="text"
                          disabled={isReadOnly}
                          value={q[`option${opt}`]}
                          onChange={(e) =>
                            handleQuestionFieldChange(
                              idx,
                              `option${opt}`,
                              e.target.value,
                            )
                          }
                          placeholder={`Option ${opt} text`}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-400 transition"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Answer Selection, Level & Question Image */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Correct Answer & Difficulty Level */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Correct Option
                      </label>
                      <select
                        disabled={isReadOnly}
                        value={q.correctAnswer}
                        onChange={(e) =>
                          handleQuestionFieldChange(
                            idx,
                            "correctAnswer",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-400 transition"
                      >
                        <option value="A">Option A</option>
                        <option value="B">Option B</option>
                        <option value="C">Option C</option>
                        <option value="D">Option D</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Difficulty Level
                      </label>
                      <select
                        value={q.level}
                        onChange={(e) =>
                          handleQuestionFieldChange(
                            idx,
                            "level",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-400 transition"
                      >
                        {LEVEL_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Question Image (Single) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Attachment Image
                    </label>

                    {/* Render Image Preview */}
                    {q.pendingPreviewUrl || q.contentImageUrl ? (
                      <div className="relative rounded-xl border border-slate-100 bg-slate-50/50 p-2 flex items-center justify-between gap-3 animate-fadeIn">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                            <img
                              src={q.pendingPreviewUrl || q.contentImageUrl}
                              alt="Question attachment preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                              {q.pendingPreviewUrl
                                ? "Pending Upload"
                                : "Uploaded Image"}
                            </p>
                            <p className="text-xs font-semibold text-slate-700 truncate max-w-[120px]">
                              {q.pendingImage
                                ? q.pendingImage.name
                                : "attachment.jpg"}
                            </p>
                          </div>
                        </div>
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-red-500 rounded-lg transition"
                            title="Remove Image"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ) : /* File Picker button */
                    !isReadOnly ? (
                      <div>
                        <input
                          type="file"
                          id={`file-input-${idx}`}
                          accept="image/*"
                          onChange={(e) => handleImageChange(idx, e)}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            document
                              .getElementById(`file-input-${idx}`)
                              ?.click()
                          }
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition active:scale-95 bg-slate-50/20"
                        >
                          <ImageIcon size={14} className="text-slate-400" />
                          Attach Image file
                        </button>
                      </div>
                    ) : (
                      <div className="border border-dashed border-slate-100 rounded-xl p-3 text-center text-xs text-slate-400 italic bg-slate-50/50">
                        No attached image
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Add question button */}
      {!isReadOnly && activeQuestions.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={handleAddQuestion}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold rounded-xl transition shadow-sm active:scale-95 border border-indigo-100"
          >
            <Plus size={14} />
            Add Another Question
          </button>
        </div>
      )}
    </div>
  );
}
