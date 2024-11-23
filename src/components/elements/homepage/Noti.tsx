import React, { useState } from "react";
import useNotifications from "@/hooks/useNotification";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TNotification } from "@/types/noti";
import focusPostStore from "@/store/focusPostStore";

const Noti = () => {
  const { setFocusPost, setPost } = focusPostStore();
  const { getNotifications, markAsRead } = useNotifications();
  const { data: notifications, isLoading, error } = getNotifications();

  // State để kiểm soát dialog
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  if (isLoading) return <div>Đang tải thông báo...</div>;
  if (error) return <div>Có lỗi xảy ra khi tải thông báo</div>;

  const unreadNotifications = notifications?.filter(
    (noti: TNotification) => !noti.isRead
  );

  const handleViewPost = (postId: string, isRead: boolean, id: string) => {
    setFocusPost(true);
    setPost(postId);
    if (!isRead) handleMarkAsRead(id);

    // Đóng dialog sau khi chọn thông báo
    setDialogOpen(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md w-full min-h-[50%] max-h-[50%] p-4">
      <h1 className="text-xl font-bold text-center border-b pb-2">Thông báo</h1>
      <div className="mt-3 space-y-4">
        {notifications?.length > 0 ? (
          notifications.slice(0, 3).map((notification: TNotification) => (
            <div
              key={notification.id}
              onClick={() =>
                handleViewPost(
                  notification.postId,
                  notification.isRead,
                  notification.id
                )
              }
              className={`py-1 px-3 border rounded-lg cursor-pointer ${
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

        {notifications?.length > 3 && (
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button className="text-blue-500 text-sm font-medium hover:underline text-center w-full">
                Xem thêm
              </button>
            </DialogTrigger>
            <DialogContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
                </TabsList>
                <TabsContent
                  className="overflow-y-auto max-h-[70dvh]"
                  value="all"
                >
                  {notifications.map((notification: TNotification) => (
                    <div
                      onClick={() =>
                        handleViewPost(
                          notification.postId,
                          notification.isRead,
                          notification.id
                        )
                      }
                      key={notification.id}
                      className={`cursor-pointer py-1 px-3 border rounded-lg my-2 overflow-y-auto ${
                        notification.isRead ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <p className="text-sm">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString(
                            "vi-VN"
                          )}
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
                  ))}
                </TabsContent>
                <TabsContent
                  className="overflow-y-auto max-h-[70dvh]"
                  value="unread"
                >
                  {unreadNotifications?.length > 0 ? (
                    unreadNotifications.map((notification: TNotification) => (
                      <div
                        onClick={() =>
                          handleViewPost(
                            notification.postId,
                            notification.isRead,
                            notification.id
                          )
                        }
                        key={notification.id}
                        className="cursor-pointer py-1 px-3 border rounded-lg my-2 bg-white"
                      >
                        <p className="text-sm">{notification.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleString(
                              "vi-VN"
                            )}
                          </span>
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-blue-500 text-xs hover:underline"
                          >
                            Đánh dấu đã đọc
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      Không có thông báo chưa đọc
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Noti;
