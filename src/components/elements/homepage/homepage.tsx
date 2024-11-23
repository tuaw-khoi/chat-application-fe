import focusPostStore from "@/store/focusPostStore";
import ListPost from "./ListPost";
import Noti from "./Noti";
import Post from "./Post";
import RecommendAddFr from "./RecommendAddFr";
import PostFocus from "./PostFocus";

const Homepage = () => {
  const { isFocusedPost, postIsChoiced } = focusPostStore();
  return (
    <div className="h-[97.5dvh] my-2 w-full mr-16 rounded-r-2xl ml-[330px]">
      <div className="flex h-full ">
        <div className="w-2/3 mx-7 flex flex-col">
          {!isFocusedPost && postIsChoiced === null ? (
            <>
              <Post />
              <h1 className="text-xl font-semibold mt-5">Tin mới</h1>
              <div className=" h-[70vh] ">
                <ListPost />
              </div>
            </>
          ) : (
            <div>
              <PostFocus />
            </div>
          )}
        </div>
        <div className="w-[20%] bg-gray-200 rounded-2xl fixed right-24 h-[97.5dvh] space-y-5">
          <div className=" h-full rounded-2xl flex flex-col space-y-5">
            <Noti />
            <RecommendAddFr />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
