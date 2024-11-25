import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

// Cấu hình mặc định cho biểu đồ
const chartConfig = {
  desktop: {
    label: "users",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type TUsersOfMonth = {
  month: string;
  user: number;
};

type TUsersInfo = {
  chartData: TUsersOfMonth[];
};

const Chart = ({ chartData }: TUsersInfo) => {
  return (
    <div>
      <Card className="w-[55%] mt-7 ml-44 ">
        <CardHeader>
          <CardTitle>Thống kê người dùng</CardTitle>
          <CardDescription>6 tháng gần nhất</CardDescription>
        </CardHeader>
        <CardContent className="">
          <ChartContainer config={chartConfig}>
            <BarChart width={500} height={300} data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="users" fill="var(--color-desktop)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm ">
          <div className="flex gap-2 font-medium leading-none">
            Chi tiết số lượng tài khoản được tạo trong 6 tháng gần nhất{" "}
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Nhấn vào để xem
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Chart;
