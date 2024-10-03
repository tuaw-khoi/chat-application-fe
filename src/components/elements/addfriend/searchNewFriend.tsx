"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useUser from "@/hooks/useUser";


const formSchema = z.object({
  emailorusername: z.string().min(2, {
    message: "Thông tin tìm kiếm phải có ít nhất 2 ký tự.",
  }),
});

type FormSchemaType = z.infer<typeof formSchema>; // Kiểu dữ liệu của form

const SearchNewFriend = () => {
  const { searchNewFriend } = useUser();
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailorusername: "",
    },
  });

  // Xử lý khi submit form
  const onSubmit = (data: FormSchemaType) => {
    if (data === null) return;

    searchNewFriend.mutate(data.emailorusername);
    form.setValue("emailorusername", "");
  };

  return (
    <div className="pt-3  ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-[300px] sm:max-w-[550px] "
        >
          <FormField
            control={form.control}
            name="emailorusername"
            render={({ field }) => (
              <FormItem>
                <div className="flex">
                  <FormLabel className="">
                    <img
                      className="w-10 h-10 "
                      src="src/asset/avatarDefault.svg"
                      alt=""
                    />
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="ml-2"
                      placeholder="Nhập thông tin"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex justify-end">
            <Button className="" type="submit">
              Tìm kiếm
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SearchNewFriend;
