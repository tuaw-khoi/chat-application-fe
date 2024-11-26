import { useForm, Controller } from "react-hook-form"; // Đảm bảo import useForm và Controller
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useUploadImage from "@/hooks/useUploadImg";
import { TPost } from "@/types/post";
import { TUser } from "@/types/user";
import usePost from "@/hooks/usePost";

export interface editPostDetailProps {
  post: TPost;
  user: TUser;
  onClose: () => void;
}

const EditPost = ({ post, user, onClose }: editPostDetailProps) => {
  const { content, photos, isPublic } = post;
  const { useUpdatePost } = usePost();
  const { mutate } = useUpdatePost();
  const [image, setImage] = useState<string | null>(photos?.[0] || null);
  const [privacy, setPrivacy] = useState<string>(isPublic.toString()); // Chế độ hiển thị
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content,
      isPublic: isPublic.toString(),
    },
  });

  const { uploadImage, loading: uploadingImage } = useUploadImage();

  // Theo dõi sự thay đổi trong form
  const formValues = watch();
  const hasChanges =
    formValues.content !== content ||
    formValues.isPublic !== isPublic.toString() ||
    (image !== photos?.[0] && image !== "");

  console.log(photos?.[0]);

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadedImage = await uploadImage(file);
      if (uploadedImage) {
        setImage(uploadedImage.imageUrl);
      }
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleCancel = () => {
    if (hasChanges && !confirm("Bạn có chắc muốn hủy các thay đổi?")) {
      return;
    }
    onClose();
  };

  const onSubmit = (data: any) => {
    const updatedPost = {
      ...post,
      content: data.content,
      isPublic: privacy === "true",
      photos: image ? [image] : [""],
    };
    mutate({ postId: post.id, updatePostDto: updatedPost });
    onClose();
  };

  useEffect(() => {
    reset({ content, isPublic: isPublic.toString() });
    setImage(photos?.[0] || null);
  }, [post]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 shadow-lg rounded-lg z-50">
      <h2 className="text-xl font-semibold mb-4">Chỉnh sửa bài viết</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nội dung bài viết */}
        <div>
          <label htmlFor="content" className="block mb-2 text-gray-600">
            Nội dung bài viết
          </label>
          <Textarea
            id="content"
            {...register("content", {
              required: "Nội dung không được để trống",
            })}
            className="w-full p-4 rounded-lg resize-none"
            rows={4}
          />
          {errors.content && (
            <p className="text-sm text-red-500">{errors.content.message}</p>
          )}
        </div>

        {/* Chế độ hiển thị */}
        <div>
          <label htmlFor="isPublic" className="block mb-2 text-gray-600">
            Chế độ hiển thị
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setPrivacy("true")}
              className={`px-4 py-2 rounded-lg ${
                privacy === "true" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Bạn bè
            </button>
            <button
              type="button"
              onClick={() => setPrivacy("false")}
              className={`px-4 py-2 rounded-lg ${
                privacy === "false" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Chỉ mình tôi
            </button>
          </div>
        </div>

        {/* Hình ảnh */}
        <div>
          <label className="block mb-2 text-gray-600">Hình ảnh</label>
          {image ? (
            <div className="relative">
              <img
                src={image}
                alt="Uploaded"
                className="h-20 w-20 rounded-md object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                X
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleAddImage}
              className="mt-2"
            />
          )}
          {uploadingImage && (
            <p className="text-sm text-gray-400 animate-pulse">
              Đang tải ảnh...
            </p>
          )}
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Hủy
          </Button>
          <Button type="submit" disabled={!hasChanges}>
            Cập nhật
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
