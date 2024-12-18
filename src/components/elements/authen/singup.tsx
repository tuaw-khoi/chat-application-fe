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
import useAuth from "@/hooks/useAuth";

// Định nghĩa schema xác thực với zod
const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "Tên đăng nhập phải có ít nhất 2 ký tự.",
    }),
    email: z
      .string()
      .min(1, { message: "Trường này không được bỏ trống." })
      .email("Địa chỉ email không hợp lệ."),
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." })
      .refine((value) => /\d/.test(value), {
        message: "Mật khẩu phải chứa ít nhất một chữ số (0-9).",
      }),
    password2: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
    fullname: z.string().min(2, {
      message: "Họ và tên phải có ít nhất 2 ký tự.",
    }),
  })
  .refine((values) => values.password === values.password2, {
    message: "Mật khẩu không khớp!",
    path: ["password2"],
  });

const Register = () => {
  const { register } = useAuth();
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullname: "",
      password2: "",
    },
  });

  const onSubmit = (formData: any) => {
    const userRegister = {
      username: formData.username,
      fullname: formData.fullname,
      password: formData.password,
      email: formData.email,
    };
    register.mutate(userRegister);
    form.setValue("username", "");
    form.setValue("email", "");
    form.setValue("password", "");
    form.setValue("fullname", "");
    form.setValue("password2", "");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-[300px] sm:max-w-[550px] mx-auto my-0 p-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>Đăng Ký</CardTitle>
            <CardDescription>Nếu chưa có tài khoản hãy đăng ký</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ Và Tên</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10"
                      placeholder="Họ Và Tên"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input className="h-10" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Đăng Nhập</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10"
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
                <FormItem>
                  <FormLabel>Mật Khẩu</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10"
                      type="password"
                      placeholder="Mật Khẩu"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật Khẩu Lần 2</FormLabel>
                  <FormControl>
                    <Input
                      className="h-10"
                      type="password"
                      placeholder="Mật Khẩu lần 2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button className="bg-amber-400 hover:bg-amber-700" type="submit">
              Đăng Ký
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default Register;
