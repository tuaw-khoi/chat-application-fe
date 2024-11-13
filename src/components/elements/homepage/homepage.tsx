import ListPost from "./ListPost";
import Noti from "./Noti";
import Post from "./post";
import RecommendAddFr from "./RecommendAddFr";

const Homepage = () => {
  return (
    <div className="h-[97.5dvh] my-2 w-full mr-16 rounded-r-2xl ml-[330px]">
      <div className="flex h-full ">
        <div className="w-2/3 mx-7 flex flex-col">
          <Post />
          <h1 className="text-xl font-semibold mt-5">Tin mới</h1>
          <div className=" h-[70vh] ">
            <ListPost />
          </div>
        </div>
        <div className="w-[20%] bg-white rounded-2xl fixed right-24 h-[97.5dvh]">
          <Noti />
          <RecommendAddFr />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
