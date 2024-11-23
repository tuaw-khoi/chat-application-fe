import { Avatar, AvatarImage } from "@/components/ui/avatar";

type TPersonInfor = {
  friendCount: number;
  fullname: string;
  postCount: number;
  totalLikes: number;
  username: string;
  img: string;
};

const PersonInfor = ({ personInfor }: { personInfor: TPersonInfor }) => {
  const avatarSrc = personInfor?.img;
  return (
    <div>
      <div className="flex justify-between items-center px-5 mb-5">
        <div>
          <h1 className="text-2xl font-semibold">{personInfor?.fullname}</h1>
          <span className="text-xl">@{personInfor?.username}</span>
        </div>
        <div>
          <Avatar
            className={`flex justify-center items-center mt-7 ${
              avatarSrc === "src/asset/avatarDefault.svg" ? "bg-gray-400" : ""
            } w-24 h-24`}
          >
            <AvatarImage
              className="w-full h-full rounded-full"
              src={avatarSrc || "/src/asset/avatarDefault.svg"}
              alt="Avatar"
            />
          </Avatar>
        </div>
      </div>
      <div className="flex justify-evenly">
        <div className="flex flex-col space-y-3 items-center">
          <span className="text-xl">Bạn bè</span>
          <p>{personInfor?.friendCount}</p>
        </div>
        <div className="flex flex-col space-y-3 items-center">
          <span className="text-xl">Bài viết</span>
          <p>{personInfor?.postCount}</p>
        </div>
        <div className="flex flex-col space-y-3 items-center">
          <span className="text-xl">Lượt thích</span>
          <p>{personInfor?.totalLikes}</p>
        </div>
      </div>
    </div>
  );
};

export default PersonInfor;
