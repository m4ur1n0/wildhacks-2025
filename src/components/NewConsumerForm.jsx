"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { useState } from "react";
import { createConsumer } from "@/lib/db";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

// Schema
const formSchema = z.object({
  preferredName: z.string().min(1, {
    message: "Please enter your preferred name.",
  }),
});

const PreferredNameForm = () => {
  const [loading, setLoading] = useState(false);
  const {user, refreshLocalConsumer} = useAuth();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferredName: "",
    },
  });

  async function onSubmit(values) {
    console.log("Preferred Name:", values.preferredName);

    setLoading(true);
    await createConsumer(user.uid, {email : user.email, name : values.preferredName});
    // setLoading(false);
    await refreshLocalConsumer();

    router.push('/home');

  };

  return (
    <div className="max-w-md mx-auto mt-10">
      { loading ? 
        <p>Loading...</p>
        :
        <div className="max-h-[500px] border rounded-b-lg p-6 bg-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="preferredName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      }
    </div>
  );
};

export default PreferredNameForm;
