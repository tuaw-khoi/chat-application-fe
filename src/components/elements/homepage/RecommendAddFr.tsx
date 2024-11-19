import useFriendReq from "@/hooks/useFriendReq";
import AddFriendUser from "./AddFriendUser";
import { TUser } from "@/types/user";
import Cookies from "js-cookie";

const RecommendAddFr = () => {
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : "";
  const { suggestFriends } = useFriendReq();
  const data = suggestFriends(user.id);
  return (
    <div className="bg-white max-h-[47%] min-h-[47%] rounded-2xl">
      <div className="flex items-center p-2 mt-3 ml-3">
        <img className="w-7 h-7" src="src/asset/addFriend.svg" alt="" />
        <h1>Gợi ý kết bạn</h1>
      </div>
      <div className="mt-4 ml-5">
        {data.data?.slice(0, 4).map((user: TUser) => (
          <div key={user.id}>
            <AddFriendUser user={user} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendAddFr;
