import useNotifications from "@/hooks/useNotification";
import React from "react";

const Noti = () => {
  const { getNotifications, markAsRead } = useNotifications();
  const { data: notifications, isLoading, error } = getNotifications();

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  if (isLoading) return <div>Đang tải thông báo...</div>;
  if (error) return <div>Có lỗi xảy ra khi tải thông báo</div>;

  return (
    <div className="bg-white rounded-xl shadow-md w-full min-h-[50%] max-h-[50%] p-4">
      <h1 className="text-xl font-bold text-center border-b pb-2">Thông báo</h1>
      <div className="mt-4 space-y-4">
        {notifications?.length > 0 ? (
          notifications.slice(0, 3).map((notification: any) => (
            <div
              key={notification.id}
              className={`py-2 px-3 border rounded-lg cursor-pointer ${
                notification.isRead ? "bg-gray-100" : "bg-white"
              }`}
            >
              <p className="text-sm">{notification.message}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleString("vi-VN")}
                </span>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-blue-500 text-xs hover:underline"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Không có thông báo nào</p>
        )}
      </div>
    </div>
  );
};

export default Noti;
