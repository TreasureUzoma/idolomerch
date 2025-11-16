"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, Login } from "@workspace/validations";
import { ErrorMessage } from "@/components/error-message";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@workspace/axios";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    resolver: zodResolver(loginSchema),
  });

  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: async (payload: Login) => {
      await api.post(`/admin/auth/login`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Login Successful");
      router.push("/products");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err?.message : "Failed to login");
    },
  });

  const onSubmit = async (data: Login) => {
    mutate(data);
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-12 rounded-sm border">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <Input
            type="email"
            {...register("email")}
            className="w-full border rounded p-2"
          />
          <ErrorMessage message={errors.email?.message} />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <div className="relative w-full">
            <Input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="w-full border rounded p-2 pr-10"
            />

            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 scale-70"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye /> : <EyeClosed />}
            </button>
          </div>

          <ErrorMessage message={errors.password?.message} />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full py-2 rounded"
        >
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
