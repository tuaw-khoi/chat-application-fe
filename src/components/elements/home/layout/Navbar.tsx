const Navbar = () => {
  return (
    <div className="w-1/12 flex flex-col items-center">
      <div className="mb-4">Q</div>
      <div>
        <img className="w-16" src="src/asset/chaticon.svg" alt="Chat icon" />
      </div>
    </div>
  );
};

export default Navbar;
{
  /* {user.avatar ? (
          <img
            src={user.avatar}
            alt="Ảnh đại diện"
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <div className="flex items-center justify-center w-16 h-16 bg-gray-300 rounded-full text-xl font-bold text-white">
            {user.name.charAt(0)} {/* Hiển thị chữ cái đầu của tên */
}
// </div>
// )} */}
