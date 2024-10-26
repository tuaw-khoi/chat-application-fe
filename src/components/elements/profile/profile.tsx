"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import useUploadImage from "@/hooks/useUploadImg";
import useUser from "@/hooks/useUser";
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { useToast } from "@/hooks/use-toast"; // Import useToast

// Định nghĩa schema cho form cập nhật hồ sơ và mật khẩu
const profileSchema = z.object({
  fullname: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
  img: z.string().optional(),
});

const passwordSchema = z
  .object({
    username: z.string().optional(),
    currentPassword: z
      .string()
      .min(2, "Mật khẩu hiện tại phải ít nhất 2 ký tự."),
    newPassword: z.string().min(6, "Mật khẩu mới phải ít nhất 6 ký tự."),
    confirmPassword: z
      .string()
      .min(6, "Mật khẩu xác nhận phải ít nhất 6 ký tự."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp với mật khẩu mới.",
    path: ["confirmPassword"], // Trỏ vào trường confirmPassword nếu lỗi
  });

const Profile = () => {
  const userCookie = Cookies.get("user");
  const storedUser = userCookie ? JSON.parse(userCookie) : null;
  const userId = storedUser?.id;
  const { uploadImage, loading: uploading, error } = useUploadImage();
  const [avatarSrc, setAvatarSrc] = useState(
    storedUser?.img || "src/asset/avatarDefault.svg"
  );
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const { updateProfile, changePassword } = useUser();
  const { toast } = useToast(); // Khởi tạo toast

  // Khởi tạo form cập nhật thông tin
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullname: storedUser?.fullname || "",
      img: storedUser?.img || "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const response = await uploadImage(file);
      if (response) {
        setAvatarSrc(response.imageUrl);
        profileForm.setValue("img", response.imageUrl);
      }
    }
  };

  const onSubmitProfile = async (data: z.infer<typeof profileSchema>) => {
    try {
      await updateProfile.mutateAsync(data);
      toast({
        title: "Cập nhật thành công!",
        description: "Thông tin cá nhân đã được cập nhật.",
        duration: 2000,
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        title: "Lỗi!",
        description: "Có lỗi xảy ra khi cập nhật thông tin cá nhân.",
        duration: 2000,
        className: "bg-red-500 text-white",
      });
    }
  };

  const onSubmitPassword = async (data: z.infer<typeof passwordSchema>) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast({
        title: "Cập nhật mật khẩu thành công!",
        description: "Mật khẩu đã được thay đổi.",
        duration: 2000,
        className: "bg-green-500 text-white",
      });
      passwordForm.reset();
      setShowPasswordForm(false);
    } catch (error) {
      toast({
        title: "Lỗi!",
        description: "Có lỗi xảy ra khi thay đổi mật khẩu.",
        duration: 2000,
        className: "bg-red-500 text-white",
      });
    }
  };

  const hasProfileChanged = () => {
    const currentValues = profileForm.getValues();
    return (
      currentValues.fullname !== storedUser?.fullname ||
      (currentValues.img !== storedUser?.img && currentValues.img !== "")
    );
  };

  const handleDialogClose = () => {
    profileForm.reset();
    passwordForm.reset();
    setAvatarSrc(storedUser?.img || "src/asset/avatarDefault.svg"); 
    setShowPasswordForm(false);
  };

  return (
    <div>
      <Dialog onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogTrigger className="text-sm p-2 w-full text-left hover:bg-gray-100">
          Trang cá nhân
        </DialogTrigger>
        <DialogContent className="px-6 bg-gray-50 rounded-lg">
          <Toaster />
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-blue-600 -mb-7">
              Cập nhật thông tin cá nhân
            </DialogTitle>
          </DialogHeader>

          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onSubmitProfile)}
              className="space-y-1"
            >
              {/* Avatar với nút upload */}
              <div className="flex flex-col items-center">
                <Avatar
                  className={`flex justify-center items-center mt-5 ${
                    avatarSrc === "src/asset/avatarDefault.svg"
                      ? "bg-gray-400"
                      : ""
                  } w-24 h-24`}
                >
                  <AvatarImage
                    className="w-full h-full rounded-full"
                    src={avatarSrc}
                    alt="Avatar"
                  />
                </Avatar>
                <Input
                  type="file"
                  accept="image/*"
                  className="mt-2"
                  onChange={handleImageChange}
                />
                {uploading && <p>Đang tải ảnh lên...</p>}
                {error && <p className="text-red-500">{error}</p>}
              </div>

              <FormField
                control={profileForm.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Họ và tên" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={!hasProfileChanged()}
                type="submit"
                className="bg-blue-500 hover:bg-blue-700"
              >
                Cập nhật
              </Button>
            </form>
          </Form>

          {/* Nút Thay đổi mật khẩu */}
          <p
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-sm text-blue-600 cursor-pointer underline mt-4"
          >
            Thay đổi mật khẩu
          </p>

          {/* Form thay đổi mật khẩu */}
          {showPasswordForm && (
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                className="space-y-4 mt-4"
              >
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu hiện tại</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Mật khẩu hiện tại"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Mật khẩu mới"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Xác nhận mật khẩu mới"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="bg-blue-500 hover:bg-blue-700">
                  Thay đổi mật khẩu
                </Button>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
