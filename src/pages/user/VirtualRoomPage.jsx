import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  PhoneOff,
  RotateCw,
  AlertTriangle,
  Clock,
  User,
  Shield,
  ArrowLeft,
  Award,
} from "lucide-react";
import {
  useRoomAccess,
  useMyInterviewBookings,
  useCompleteInterviewBooking,
} from "@/hooks/interview/useInterviewApi";
import { useAuth } from "@/hooks/auth/useAuth";
import { formatDateTime } from "@/components/interview/common/interviewUtils";
import ReportIssueModal from "@/components/bookings/ReportIssueModal";

export default function VirtualRoomPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { data: user } = useAuth();

  const { data: roomAccess, isLoading: loadingAccess } = useRoomAccess(bookingId);
  const { data: bookingsData } = useMyInterviewBookings();
  const completeMutation = useCompleteInterviewBooking();

  const booking = (bookingsData?.content || []).find((b) => b.id === bookingId);

  // In-call media controls state
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Video streams refs for local camera
  const localVideoRef = useRef(null);

  // Real-time remaining countdown calculation
  const [timeLeftStr, setTimeLeftStr] = useState("");

  useEffect(() => {
    if (!roomAccess?.closesAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const closeTime = new Date(roomAccess.closesAt).getTime();
      const diff = closeTime - now;

      if (diff <= 0) {
        setTimeLeftStr("00:00:00 (Hết giờ)");
        clearInterval(interval);
      } else {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeftStr(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}:${String(seconds).padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [roomAccess]);

  // Request camera stream for local preview if enabled
  useEffect(() => {
    let stream = null;
    if (cameraEnabled && roomAccess?.canEnter) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: micEnabled })
        .then((s) => {
          stream = s;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn("Camera/Mic access denied or unavailable:", err);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraEnabled, micEnabled, roomAccess?.canEnter]);

  const handleRejoin = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
    }, 1200);
  };

  const handleEndInterview = () => {
    if (window.confirm("Xác nhận KẾT THÚC HOÀN TOÀN buổi phỏng vấn? Phòng phỏng vấn sẽ được đóng vĩnh viễn.")) {
      const schedulePath = isInterviewer ? "/interviewer/schedule" : "/interview/schedule";
      completeMutation.mutate(bookingId, {
        onSuccess: () => {
          navigate(schedulePath);
        },
        onError: () => {
          navigate(schedulePath);
        },
      });
    }
  };

  if (loadingAccess) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Đang tải phòng phỏng vấn...</p>
      </div>
    );
  }

  // ROOM NOT ACCESSIBLE (BEFORE START OR EXPIRED)
  if (!roomAccess?.canEnter) {
    const isBeforeStart = roomAccess?.status === "BEFORE_START";
    const isExpired = roomAccess?.status === "EXPIRED";

    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
            {isBeforeStart ? <Clock size={32} /> : <Shield size={32} />}
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-100">
              {isBeforeStart
                ? "Phòng phỏng vấn chưa đến giờ mở"
                : isExpired
                ? "Phòng phỏng vấn đã đóng"
                : "Không thể truy cập phòng phỏng vấn"}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {roomAccess?.message || "Vui lòng kiểm tra lại thời gian của buổi phỏng vấn."}
            </p>
          </div>

          {booking?.scheduledAt && (
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 text-xs space-y-1">
              <span className="text-slate-400 block font-medium">Thời gian lên lịch:</span>
              <span className="text-indigo-300 font-bold block text-sm">
                {formatDateTime(booking.scheduledAt)}
              </span>
              <span className="text-slate-400 block text-[11px]">
                Thời lượng: {booking?.durationMinutes || 60} phút
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/25"
          >
            <ArrowLeft size={16} />
            Quay lại Lịch làm việc
          </button>
        </div>
      </div>
    );
  }

  // ACTIVE FULL-SCREEN VIRTUAL ROOM UI
  const isInterviewer = booking?.interviewerId === user?.id;
  const remoteParticipantName = isInterviewer
    ? booking?.candidateName || "Ứng viên"
    : booking?.interviewerName || "Người phỏng vấn";

  return (
    <div className="h-screen w-screen bg-slate-950 text-white flex flex-col overflow-hidden select-none">
      {/* Top Header Bar */}
      <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0077b6] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#0077b6]/30">
            <Award size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 leading-tight">
              {booking?.profileTitle || "Phòng Phỏng Vấn Trực Tuyến"}
            </h1>
            <p className="text-[11px] font-medium text-slate-400">
              Buổi phỏng vấn với <span className="text-[#0077b6] font-bold">{remoteParticipantName}</span>
            </p>
          </div>
        </div>

        {/* Live Session Timer & Report Button */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-800/80 border border-slate-700/80 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-[#bae6fd] shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <Clock size={14} className="text-[#0077b6]" />
            <span>Còn lại: {timeLeftStr}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition cursor-pointer"
          >
            <AlertTriangle size={14} />
            Báo sự cố
          </button>
        </div>
      </header>

      {/* Main Video Cockpit (2 Large Display Windows Side-by-Side) */}
      <main className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0 relative">
        {/* Remote Participant Tile */}
        <div className="relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-2xl group">
          <div className="w-24 h-24 rounded-3xl bg-slate-800 border border-[#0077b6]/30 text-[#0077b6] flex items-center justify-center font-bold text-3xl shadow-inner mb-3">
            {remoteParticipantName.charAt(0).toUpperCase()}
          </div>
          <p className="text-base font-bold text-slate-200">{remoteParticipantName}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {isInterviewer ? "Ứng viên" : "Người phỏng vấn"}
          </p>

          <div className="absolute top-4 left-4 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{remoteParticipantName}</span>
          </div>
        </div>

        {/* Local Participant Tile */}
        <div className="relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-2xl group">
          {cameraEnabled ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-3xl bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center font-bold text-3xl shadow-inner mb-3">
                <User size={40} />
              </div>
              <p className="text-base font-bold text-slate-200">Bạn ({user?.username})</p>
              <p className="text-xs text-slate-500 mt-0.5">Camera đang tắt</p>
            </div>
          )}

          <div className="absolute top-4 left-4 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0077b6]" />
            <span>Bạn</span>
          </div>

          {!micEnabled && (
            <div className="absolute top-4 right-4 bg-rose-500/20 text-rose-300 p-2 rounded-xl border border-rose-500/30">
              <MicOff size={16} />
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Control Bar */}
      <footer className="h-20 bg-slate-900/90 backdrop-blur-md border-t border-slate-800/80 px-3 sm:px-6 flex items-center justify-center gap-2 sm:gap-4 flex-shrink-0 z-20">
        {/* Toggle Mic */}
        <button
          type="button"
          onClick={() => setMicEnabled(!micEnabled)}
          className={`p-3.5 rounded-2xl border transition-all ${
            micEnabled
              ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              : "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30"
          }`}
          title={micEnabled ? "Tắt Micro" : "Bật Micro"}
        >
          {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        {/* Toggle Camera */}
        <button
          type="button"
          onClick={() => setCameraEnabled(!cameraEnabled)}
          className={`p-3.5 rounded-2xl border transition-all ${
            cameraEnabled
              ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
              : "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30"
          }`}
          title={cameraEnabled ? "Tắt Camera" : "Bật Camera"}
        >
          {cameraEnabled ? <VideoIcon size={20} /> : <VideoOff size={20} />}
        </button>

        {/* Toggle Screen Share */}
        <button
          type="button"
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className={`p-3.5 rounded-2xl border transition-all ${
            isScreenSharing
              ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30"
              : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
          }`}
          title="Chia sẻ màn hình"
        >
          <Monitor size={20} />
        </button>

        <div className="h-8 w-[1px] bg-slate-800 my-auto" />

        {/* Rejoin Room button (handle disconnection) */}
        <button
          type="button"
          onClick={handleRejoin}
          disabled={isConnecting}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
          title="Tham gia lại nếu rớt mạng"
        >
          <RotateCw size={16} className={isConnecting ? "animate-spin" : ""} />
          <span className="hidden sm:inline">{isConnecting ? "Đang kết nối lại..." : "Tham gia lại"}</span>
        </button>

        {/* Temporary Exit Button (allows rejoining via Schedule) */}
        <button
          type="button"
          onClick={() => navigate(isInterviewer ? "/interviewer/schedule" : "/interview/schedule")}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
          title="Rời phòng tạm thời - Bạn có thể vào lại bất kỳ lúc nào từ Lịch phỏng vấn"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Thoát tạm thời</span>
        </button>

        {/* End / Complete Interview Session */}
        <button
          type="button"
          onClick={handleEndInterview}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-2xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-500 transition shadow-lg shadow-rose-600/30"
          title="Kết thúc phỏng vấn hoàn tất"
        >
          <PhoneOff size={16} />
          <span className="hidden sm:inline">Kết thúc phỏng vấn</span>
        </button>
      </footer>

      {/* Report Issue Modal */}
      {showReportModal && (
        <ReportIssueModal
          bookingId={bookingId}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
