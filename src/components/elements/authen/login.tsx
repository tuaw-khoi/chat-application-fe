"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Navigate } from "react-router-dom";
import Google from "./google";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "password must be at least 2 characters.",
  }),
});
const FormLogin = () => {
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = async (data: any) => {
    form.setValue("username", "");
    form.setValue("password", "");
  };
  return (
    <div>
        <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-[300px] sm:max-w-[550px]"
      >
        <Card className="">
          <CardHeader>
            <CardTitle>Tài Khoản</CardTitle>
            <CardDescription>
              Đăng nhập tại đây! Nhấn nút đăng nhập
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Tên Đăng Nhập</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="current-User"
                      placeholder="Tên Đăng Nhập"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Mật Khẩu</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="current-password"
                      type="password"
                      placeholder="Mật Khẩu"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              className="bg-blue-400 hover:bg-blue-700 rounded-[4px]"
              type="submit"
            >
              Đăng Nhập
            </Button>
          </CardFooter>
        </Card>
      </form>

    </Form>
              <div className="bg-gray-200 divide-y "></div>
               <div>
               <Google/>
               </div>
    </div>
  );
};

export default FormLogin;