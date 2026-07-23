import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Clock,
  X,
  Inbox,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

import { fetchNotifications, markNotificationRead } from "@/api/notifications";

/* ── Time Ago Formatter ────────────────────────────── */
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/* ── Component ─────────────────────────────────────── */
export default function NotificationBell() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const { data, isError } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 30_000,
    retry: 1,
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  // Click outside to close
  const handleClickOutside = useCallback(
    (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClickOutside]);

  const handleRead = (notification) => {
    if (!notification.read) {
      markReadMutation.mutate(notification.id);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* ── Bell Button ─────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((c) => !c)}
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
          open
            ? "bg-[#0077b6] text-white shadow-md shadow-[#0077b6]/25"
            : "text-[#64748b] hover:bg-[#f0f7ff] hover:text-[#0077b6]"
        }`}
        aria-label="Thông báo"
      >
        {unreadCount > 0 ? (
          <BellRing size={20} className={open ? "" : "animate-[wiggle_1s_ease-in-out]"} />
        ) : (
          <Bell size={20} />
        )}

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#ef4444] text-[10px] font-bold text-white ring-2 ring-white shadow-sm px-1 leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown Panel ──────────────────────────── */}
      {open && (
        <div className="absolute right-0 z-50 mt-2.5 w-[360px] max-w-[calc(100vw-24px)] rounded-2xl border border-[#e2e8f0] bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e2e8f0] bg-gradient-to-r from-white to-[#f8fafc]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#f0f7ff] border border-[#bae6fd] flex items-center justify-center">
                <Bell size={15} className="text-[#0077b6]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0f172a]">Thông báo</h3>
                {unreadCount > 0 && (
                  <p className="text-[10px] font-semibold text-[#0077b6]">
                    {unreadCount} chưa đọc
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[#94a3b8] hover:text-[#64748b] hover:bg-[#f1f5f9] p-1.5 rounded-lg transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
            {isError && (
              <div className="px-5 py-8 text-center">
                <div className="w-11 h-11 mx-auto rounded-xl bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center mb-3">
                  <Bell size={20} className="text-[#ef4444]" />
                </div>
                <p className="text-xs font-semibold text-[#64748b]">
                  Không thể tải thông báo
                </p>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">
                  Vui lòng thử lại sau
                </p>
              </div>
            )}

            {!isError && notifications.length === 0 && (
              <div className="px-5 py-10 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#f0f7ff] border border-[#bae6fd] flex items-center justify-center mb-3">
                  <Inbox size={24} className="text-[#0077b6]" />
                </div>
                <p className="text-sm font-bold text-[#0f172a]">
                  Không có thông báo
                </p>
                <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
                  Bạn sẽ nhận được thông báo khi có hoạt động mới liên quan đến bạn.
                </p>
              </div>
            )}

            {!isError &&
              notifications.map((notification, index) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleRead(notification)}
                  className={`group w-full text-left px-5 py-3.5 flex items-start gap-3.5 transition-all duration-150 cursor-pointer relative ${
                    !notification.read
                      ? "bg-[#f0f7ff]/60 hover:bg-[#e0f2fe]/60"
                      : "bg-white hover:bg-[#f8fafc]"
                  } ${
                    index < notifications.length - 1
                      ? "border-b border-[#f1f5f9]"
                      : ""
                  }`}
                >
                  {/* Unread Indicator Dot */}
                  {!notification.read && (
                    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#0077b6]" />
                  )}

                  {/* Icon Container */}
                  <div
                    className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition ${
                      !notification.read
                        ? "bg-[#0077b6]/10 border border-[#0077b6]/20 text-[#0077b6]"
                        : "bg-[#f1f5f9] border border-[#e2e8f0] text-[#94a3b8]"
                    }`}
                  >
                    {!notification.read ? (
                      <BellRing size={15} />
                    ) : (
                      <Check size={15} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[13px] leading-snug ${
                        !notification.read
                          ? "font-bold text-[#0f172a]"
                          : "font-medium text-[#64748b]"
                      }`}
                    >
                      {notification.title}
                    </p>
                    {notification.content && (
                      <p className="mt-0.5 text-[11px] text-[#94a3b8] leading-relaxed line-clamp-2">
                        {notification.content}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Clock size={10} className="text-[#cbd5e1]" />
                      <span className="text-[10px] font-medium text-[#cbd5e1]">
                        {timeAgo(notification.createdAt)}
                      </span>
                      {notification.read && (
                        <span className="flex items-center gap-0.5 text-[10px] font-medium text-[#94a3b8]">
                          <CheckCheck size={10} className="text-[#10b981]" />
                          Đã đọc
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-5 py-2.5 border-t border-[#f1f5f9] bg-[#f8fafc]/60 text-center">
              <span className="text-[10px] font-semibold text-[#94a3b8]">
                Hiển thị {notifications.length} thông báo gần nhất
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
