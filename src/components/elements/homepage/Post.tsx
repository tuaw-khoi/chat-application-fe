"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Cookies from "js-cookie";
import useUploadImage from "@/hooks/useUploadImg";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import usePost from "@/hooks/usePost";
import focusPostStore from "@/store/focusPostStore";
import { useNavigate } from "react-router-dom";

// Định nghĩa schema cho form
const formSchema = z.object({
  textContent: z.string().min(1, {
    message: "Vui lòng nhập nội dung bài viết.",
  }),
  privacy: z.string().min(1, {
    message: "Vui lòng chọn chế độ hiển thị.",
  }),
  imageUrl: z.string().optional(),
});

const Post = () => {
  const { setFocusPost } = focusPostStore();
  const [user, setUser] = useState(() => {
    const userCookie = Cookies.get("user");
    return userCookie ? JSON.parse(userCookie) : null;
  });
  const [img, setImg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Thêm ref
  const { uploadImage, loading: uploadingImage, error } = useUploadImage();
  const { useCreatePost } = usePost();
  const { mutate: createPost } = useCreatePost();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/profile", { state: { id: user.id } });
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false); // Thêm state để theo dõi trạng thái dialog

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      textContent: "",
      privacy: "true",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: any) => {
    const postForm = {
      content: data.textContent,
      isPublic: data.privacy,
      photos: [img || ""],
    };
    createPost(postForm);
    form.reset();
    setImg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset giá trị của input file sau submit
    }
    setIsDialogOpen(false); // Đóng dialog sau khi submit
    setFocusPost(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadedImageUrl = await uploadImage(file);
      if (uploadedImageUrl) {
        setImg(uploadedImageUrl.imageUrl);
        form.setValue("imageUrl", uploadedImageUrl.imageUrl);
      }
    }
  };

  const handleRemoveImage = () => {
    setImg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset giá trị của input file
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        const parsedUser = JSON.parse(userCookie);
        if (JSON.stringify(parsedUser) !== JSON.stringify(user)) {
          setUser(parsedUser); // Cập nhật khi cookie thay đổi
        }
      }
    }, 1000); // Kiểm tra cookie mỗi giây

    return () => clearInterval(interval); // Xóa interval khi unmount
  }, [user]);

  return (
    <div className="w-full h-32 px-8 rounded-2xl bg-white divide-y-2 space-y-2 shadow-md">
      <h1 className="pt-3">Đăng bài</h1>
      <div className="flex items-center pr-3 py-4">
        <Avatar
          onClick={handleNavigate}
          className={`flex justify-center items-center cursor-pointer ${
            user?.img === "src/asset/avatarDefault.svg" ? "bg-gray-400" : ""
          } w-10 h-10`}
        >
          <AvatarImage
            className="w-full h-full rounded-full"
            src={user?.img || "/src/asset/avatarDefault.svg"}
            alt="User Avatar"
          />
        </Avatar>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="flex-grow">
            <Input
              type="text"
              placeholder={`${user.fullname} ơi, bạn đang nghĩ gì thế?`}
              className="cursor-pointer ml-2 rounded-2xl py-4 bg-gray-100"
              onClick={() => setIsDialogOpen(true)}
            />
          </DialogTrigger>
          <DialogContent className="-mt-[20px]">
            <DialogHeader>
              <DialogTitle className="text-center">Tạo bài viết</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex items-center my-4 space-x-2">
                <Avatar className="bg-gray-400 flex justify-center items-center my-2">
                  <AvatarImage
                    className="w-8 h-8 "
                    src={user?.img || "/src/asset/avatarDefault.svg"}
                    alt="User Avatar"
                  />
                </Avatar>
                <div>
                  <h2 className="text-lg">{user.fullname}</h2>
                  <Controller
                    name="privacy"
                    control={form.control}
                    defaultValue="true"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          className="text-sm text-gray-400"
                          style={{ width: "120px", height: "25px" }}
                        >
                          <SelectValue placeholder="Chế độ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Bạn bè</SelectItem>
                          <SelectItem value="false">Chỉ mình tôi</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <Separator className="my-2" />
              <div>
                <Textarea
                  placeholder="Nhập nội dung bài viết"
                  {...form.register("textContent")}
                  className="w-full p-4 rounded-lg h-24 resize-none"
                />
              </div>
              <Separator className="my-2" />
              <div className="flex flex-col my-4">
                <label className="text-gray-500 mb-2">Tải ảnh lên:</label>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  ref={fileInputRef} // Thêm ref
                />
                {uploadingImage && (
                  <p className="text-sm text-gray-400">Đang tải ảnh lên...</p>
                )}
                {error && <p className="text-sm text-red-500">Lỗi: {error}</p>}
                {img && (
                  <div className="relative">
                    <img
                      src={img}
                      alt="Uploaded Preview"
                      className="h-52 w-full object-cover mt-4 rounded-lg object-center"
                    />
                    <button
                      type="button"
                      className="absolute top-4 right-0 bg-red-500 text-white rounded-full  px-2"
                      onClick={handleRemoveImage} // Sử dụng hàm mới
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-500 rounded-lg py-2 mt-4"
              >
                Đăng bài
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Post;
