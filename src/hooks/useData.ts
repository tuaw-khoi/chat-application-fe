import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

const getTimeDifference = (createdAt: any) => {
  const now = new Date();
  const createdDate = new Date(createdAt);

  const minutes = differenceInMinutes(now, createdDate);
  if (minutes < 60) {
    return `${minutes} phút trước`;
  }

  const hours = differenceInHours(now, createdDate);
  if (hours < 24) {
    return `${hours} giờ trước`;
  }

  const days = differenceInDays(now, createdDate);
  if (days < 30) {
    return `${days} ngày trước`;
  }

  const months = differenceInMonths(now, createdDate);
  if (months < 12) {
    return `${months} tháng trước`;
  }

  const years = differenceInYears(now, createdDate);
  if (years === 1) {
    return `hơn 1 năm trước`;
  }
  return `hơn ${years} năm trước`;
};

export default getTimeDifference;
