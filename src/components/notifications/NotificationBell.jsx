import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { useState } from "react";

import { fetchNotifications, markNotificationRead } from "@/api/notifications";

export default function NotificationBell() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchInterval: 30000,
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const handleRead = async (notification) => {
    if (!notification.read) {
      await markNotificationRead(notification.id);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 min-w-5 rounded-full bg-rose-600 px-1 text-[11px] font-bold leading-5 text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-lg border bg-white shadow-xl">
          <div className="border-b px-4 py-3 text-sm font-semibold text-slate-900">Notifications</div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => handleRead(notification)}
                className="block w-full border-b px-4 py-3 text-left hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                  {!notification.read && <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />}
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{notification.content}</p>
              </button>
            ))}
            {!notifications.length && (
              <p className="px-4 py-6 text-center text-sm text-slate-500">No notifications yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
