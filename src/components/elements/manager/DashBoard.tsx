import useUser from "@/hooks/useUser";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LabelInfor from "./LabelInfor";
import Chart from "./Chart";

interface ManagerInfo {
  weeklyPosts: number;
  weeklyLikes: number;
  monthlyPosts: number;
  monthlyLikes: number;
  userStats: UserStat[];
}
interface UserStat {
  month: string;
  users: number;
}

const DashBoard = () => {
  const { getManagerInfo } = useUser();
  const [inforType, setInforType] = useState<string>("tháng");
  const response = getManagerInfo();
  const data = response.data;
  if (!data) {
    return <div>Loading...</div>;
  }

  const inforOfLikes = {
    title: `Tổng lượt tương tác`,
    value: inforType === "tháng" ? data.monthlyLikes : data.weeklyLikes,
    description: `Số lượt tương tác trong ${inforType} qua`,
    img: "src/asset/adminlike.svg",
    color: "pink",
  };

  const inforOfPosts = {
    title: `Tổng lượt bài đăng`,
    value: inforType === "tháng" ? data.monthlyPosts : data.weeklyPosts,
    description: `Số lượt bài đăng trong ${inforType} qua`,
    img: "src/asset/post.svg",
    color: "blue",
  };
  return (
    <div className=" h-full">
      <div className="flex items-center justify-evenly pt-10">
        <div>
          <LabelInfor infor={inforOfPosts} />
        </div>
        <div>
          <LabelInfor infor={inforOfLikes} />
        </div>
        <div>
          <Select
            value={inforType}
            onValueChange={(value) => setInforType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value="tháng">
                Tháng
              </SelectItem>
              <SelectItem className="cursor-pointer" value="tuần">
                Tuần
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Chart chartData={data.userStats} />
      </div>
    </div>
  );
};

export default DashBoard;
