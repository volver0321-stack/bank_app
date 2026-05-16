"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/features/auth_users/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { setRole, setToken } from "@/lib/auth/token";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setSubmitError("");

    try {
      const response = await login(values);

      if (!response.data) {
        throw new Error("ログイン情報を取得できませんでした");
      }
      setToken(response.data.token);
      setRole(response.data.roles);

      router.push("/");
    } catch {
      setSubmitError("ログインに失敗しました");
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
          <CardDescription>
            Bank App にログインして利用を開始します。
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-email">
                      メールアドレス
                    </FieldLabel>
                    <Input
                      {...field}
                      id="login-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      autoComplete="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-password">パスワード</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        autoComplete="new-password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label={
                          showPassword
                            ? "パスワードを非表示にする"
                            : "パスワードを表示する"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {submitError && (
                <p className="text-sm text-destructive">{submitError}</p>
              )}
            </FieldGroup>
          </form>

          <div className="mt-4 flex flex-col gap-2 text-center text-sm">
            <Link
              href="/forgot-password"
              className="text-muted-foreground transition-colors hover:text-foreground hover:underline"
            >
              パスワードを忘れた方
            </Link>

            <p className="text-muted-foreground">
              アカウントをお持ちでない方は{" "}
              <Link
                href="/register"
                className="font-medium text-foreground hover:underline"
              >
                新規登録
              </Link>
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              リセット
            </Button>
            <Button
              type="submit"
              form="login-form"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "ログイン中..." : "ログインする"}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
