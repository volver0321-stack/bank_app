"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "@/features/auth_users/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

const registerSchema = z.object({
  firstName: z.string().min(1, "名を入力してください"),
  lastName: z.string().optional(),
  email: z.string().email("有効なメールアドレスを入力してください"),
  phoneNumber: z.string().optional(),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues) {
    setSubmitError("");

    try {
      await register(values);
      router.push("/login");
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error ? error.message : "アカウント作成に失敗しました",
      );
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>アカウント作成</CardTitle>
          <CardDescription>
            Bank App の口座を作成して利用を開始します。
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-first-name">
                      名
                    </FieldLabel>
                    <Input
                      {...field}
                      id="register-first-name"
                      aria-invalid={fieldState.invalid}
                      autoComplete="given-name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-last-name">
                      姓
                    </FieldLabel>
                    <Input
                      {...field}
                      id="register-last-name"
                      aria-invalid={fieldState.invalid}
                      autoComplete="family-name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="phoneNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-phone-number">
                      電話番号
                    </FieldLabel>
                    <Input
                      {...field}
                      id="register-phone-number"
                      aria-invalid={fieldState.invalid}
                      autoComplete="tel"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-email">メールアドレス</FieldLabel>
                    <Input
                      {...field}
                      id="register-email"
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
                    <FieldLabel htmlFor="register-password">パスワード</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="register-password"
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
        </CardContent>

        <CardFooter>
          <Field orientation="horizontal">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              リセット
            </Button>
            <Button
              type="submit"
              form="register-form"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "作成中..." : "アカウント作成"}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
