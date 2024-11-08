import ListPost from "./ListPost";
import Noti from "./Noti";
import Post from "./post";
import RecommendAddFr from "./RecommendAddFr";

const Homepage = () => {
  return (
    <div className="h-[97.5dvh] my-2 w-full mr-16 rounded-r-2xl">
      <div className="flex h-full">
        <div className="w-2/3 mx-7 flex flex-col ">
          <Post />
          <h1 className="text-xl font-semibold mt-5">Tin mới</h1>
          <ListPost />
        </div>
        <div className="w-1/3 bg-white rounded-2xl">
          <Noti />
          <RecommendAddFr />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
