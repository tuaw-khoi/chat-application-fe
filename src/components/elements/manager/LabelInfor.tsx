import React from "react";
type TLabelInfor = {
  infor: {
    title: string;
    description: string;
    img: string;
    value: number | string;
    color: string;
  };
};
const LabelInfor = ({ infor }: TLabelInfor) => {
  return (
    <div className={`px-3 py-1 bg-${infor.color}-500 rounded-xl`}>
      <div className="flex justify-between items-center space-x-3">
        <h2 className="text-xl">{infor.title}</h2>
        <img className="w-7 h-7" src={infor.img} alt="" />
      </div>
      <div className="mt-2">
        <span className="text-xl font-semibold ">{infor.value}</span>
        <p className="text-white text-xs mt-1">{infor.description}</p>
      </div>
    </div>
  );
};

export default LabelInfor;
