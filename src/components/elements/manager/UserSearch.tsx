"use client";
import { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserSearchProps {
  searchValue: string;
  refreshKey: number; // Key để làm mới component
  onRefresh: () => void; // Callback để kích hoạt làm mới từ component cha
}

const UserSearch = ({
  searchValue,
  refreshKey,
  onRefresh,
}: UserSearchProps) => {
  const [userData, setUserData] = useState<any>(null);
  const [updatedData, setUpdatedData] = useState<any>(null);
  const [isChanged, setIsChanged] = useState<boolean>(false); // Check nếu bất kỳ dữ liệu nào thay đổi
  const [isUpdated, setIsUpdated] = useState<boolean>(false); // Check nếu đã cập nhật thành công

  const { getUserWithOutPassword, deleteUser, updateUser } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      if (searchValue) {
        try {
          const data = await getUserWithOutPassword(searchValue);
          if (data) {
            setUserData(data);
            setUpdatedData(data); // Khởi tạo dữ liệu cập nhật giống với dữ liệu gốc
            setIsChanged(false); // Reset trạng thái thay đổi
          } else {
            setUserData(null);
            setUpdatedData(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
          setUpdatedData(null);
        }
      } else {
        setUserData(null);
        setUpdatedData(null);
      }
    };

    fetchUserData();
  }, [searchValue, refreshKey]); 

  useEffect(() => {
    if (
      userData &&
      updatedData &&
      (userData.username !== updatedData.username ||
        userData.fullname !== updatedData.fullname ||
        userData.Role !== updatedData.Role)
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [updatedData, userData]);

  const handleDelete = async () => {
    if (userData?.id) {
      try {
        await deleteUser.mutateAsync(userData.id);
        onRefresh();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleUpdate = async () => {
    if (userData?.id && isChanged) {
      try {
        await updateUser.mutateAsync({
          id: userData.id,
          updateUserDto: updatedData,
        });
        setIsUpdated(true);
        setTimeout(() => setIsUpdated(false), 2000);
        setIsChanged(false); 
        onRefresh();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md w-full">
      {userData ? (
        <div className="space-y-4 w-full">
          <div className="flex justify-center">
            <img
              src={userData.img || "src/asset/avatarDefault.svg"}
              alt={userData.username}
              className="w-24 h-24 rounded-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên người dùng
            </label>
            <Input
              name="username"
              value={updatedData.username || ""}
              onChange={(e) =>
                setUpdatedData((prev: any) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              className="w-full border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <Input
              name="fullname"
              value={updatedData.fullname || ""}
              onChange={(e) =>
                setUpdatedData((prev: any) => ({
                  ...prev,
                  fullname: e.target.value,
                }))
              }
              className="w-full border-gray-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              name="email"
              value={updatedData.email || ""}
              className="w-full border-gray-300"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vai trò
            </label>
            <Select
              value={updatedData.Role || "USER"}
              onValueChange={(value) =>
                setUpdatedData((prev: any) => ({ ...prev, Role: value }))
              }
            >
              <SelectTrigger className="w-full border-gray-300">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
                <SelectItem value="USER">USER</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between items-center space-x-4 mt-4">
            <Button
              className="bg-red-500 text-white hover:bg-red-600 w-full"
              onClick={handleDelete}
            >
              Xóa
            </Button>
            <Button
              className={`w-full ${
                isChanged
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleUpdate}
              disabled={!isChanged}
            >
              Cập nhật
            </Button>
          </div>
          {isUpdated && (
            <p className="text-green-500 text-center mt-2">
              Cập nhật thành công!
            </p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-center">Không tìm thấy người dùng.</p>
      )}
    </div>
  );
};

export default UserSearch;
