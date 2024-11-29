"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import UserSearch from "./UserSearch";

const UserManager = () => {
  const [searchValue, setSearchValue] = useState<string>(""); // Lưu giá trị người dùng nhập
  const [submittedSearchValue, setSubmittedSearchValue] = useState<string>(""); // Lưu giá trị sau khi nhấn "Tìm kiếm"
  const [refreshKey, setRefreshKey] = useState<number>(0); // Key để làm mới component con

  const handleSearch = () => {
    setSubmittedSearchValue(searchValue); // Cập nhật giá trị gửi xuống UserSearch
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1); // Tăng key để kích hoạt re-render
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-md flex justify-center flex-col items-center mt-36">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Quản lý người dùng
      </h1>

      <div className="flex items-center space-x-2 mb-6">
        <Input
          placeholder="Nhập username hoặc email"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)} // Cập nhật giá trị nhập
          className="w-full border-gray-300"
        />
        <Button
          onClick={handleSearch} // Gọi khi nhấn nút
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          Tìm kiếm
        </Button>
      </div>

      {/* Truyền giá trị tìm kiếm và key làm mới */}
      <UserSearch
        searchValue={submittedSearchValue}
        refreshKey={refreshKey}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default UserManager;
