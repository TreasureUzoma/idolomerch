"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, Login } from "@workspace/validations";
import { ErrorMessage } from "@/components/error-mesage";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiBaseUrl } from "@/constants";
import { toast } from "sonner";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    resolver: zodResolver(loginSchema),
  });

  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: async (payload: Login) =>
      await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Login Successful");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err?.message : "Failed to login");
    },
  });
  const onSubmit = async (data: Login) => {
    mutate(data);
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-muted p-12 rounded-sm">
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
          <Input
            type="password"
            {...register("password")}
            className="w-full border rounded p-2"
          />
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
