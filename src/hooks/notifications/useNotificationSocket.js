import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "@/hooks/auth/useAuth";

/**
 * Hook that establishes a WebSocket (STOMP over SockJS) connection to receive
 * real‑time notification updates for the authenticated user. When a new
 * notification arrives, it updates the React‑Query cache for the "notifications"
 * query, causing the NotificationBell component to re‑render instantly.
 */
export default function useNotificationSocket() {
  const queryClient = useQueryClient();
  const { data: user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const socket = new SockJS("/ws-notifications");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      const destination = `/topic/notifications/user-${user.id}`;
      stompClient.subscribe(destination, (msg) => {
        // The backend sends the full Notification entity as JSON.
        // Parse the incoming notification (currently unused but kept for future extensions).
        JSON.parse(msg.body);
        // Invalidate the notifications query so the latest feed is fetched.
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      });
    });

    return () => {
      if (stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, [user?.id, queryClient]);
}
