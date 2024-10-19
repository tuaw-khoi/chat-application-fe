// hooks/useUploadImage.ts
import { useState } from "react";
import axios from "axios";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dfua5nwki/image/upload";
const UPLOAD_PRESET = "img-upload";

interface UploadResponse {
  imageUrl: string;
}

const useUploadImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<UploadResponse | null> => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData);
      const url = response.data.secure_url;
      setImageUrl(url); // Lưu URL của ảnh đã upload
      return { imageUrl: url }; // Trả về imageUrl
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi upload ảnh");
      return null; // Trả về null nếu có lỗi
    } finally {
      setLoading(false);
    }
  };

  return { uploadImage, loading, error, imageUrl };
};

export default useUploadImage;
