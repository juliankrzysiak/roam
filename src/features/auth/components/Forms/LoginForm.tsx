"use client";

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
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Must be a valid email address." }),
  password: z.string().min(6),
});

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginForm({ setOpen }: Props) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      form.setError("root", {
        type: "custom",
        message: error.message,
      });
    }

    if (data && !error) {
      setLoading(true);
      router.push("/trips");
      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email address"
                  autoComplete="username"
                  type="email"
                  required
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
              <FormLabel>Password *</FormLabel>

              <FormControl>
                <Input
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-8">
          <Button type="submit" className="loading-button">
            <span className={clsx(!loading ? "visible" : "invisible")}>
              Submit
            </span>
            <LoaderCircle
              aria-label="Loading trips"
              className={clsx(
                loading ? "visible" : "invisible",
                "animate-spin",
              )}
            />
          </Button>
          {form.formState.errors.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}
          <Link href="/auth/reset-password">Forgot Password?</Link>
        </div>
      </form>
    </Form>
  );
}
