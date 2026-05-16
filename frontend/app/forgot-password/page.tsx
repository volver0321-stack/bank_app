"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/features/auth_users/api";

const forgotPasswordSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const [submitError, setSubmitError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  const form = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setSubmitError("");
    setSubmitMessage("");

    try {
      const response = await forgotPassword(values);
      setSubmitMessage(
        response.message ?? "パスワード再設定用のメールを送信しました",
      );
      form.reset();
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "パスワード再設定メールの送信に失敗しました",
      );
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>パスワード再設定</CardTitle>
          <CardDescription>
            登録済みのメールアドレスに再設定用の案内を送信します。
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="forgot-password-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="forgot-password-email">
                      メールアドレス
                    </FieldLabel>
                    <Input
                      {...field}
                      id="forgot-password-email"
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

              {submitError && (
                <p className="text-sm text-destructive">{submitError}</p>
              )}
              {submitMessage && (
                <p className="text-sm text-muted-foreground">
                  {submitMessage}
                </p>
              )}
            </FieldGroup>
          </form>

          <div className="mt-4 text-center text-sm">
            <Link
              href="/login"
              className="text-muted-foreground transition-colors hover:text-foreground hover:underline"
            >
              ログイン画面に戻る
            </Link>
          </div>
        </CardContent>

        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSubmitError("");
                setSubmitMessage("");
                form.reset();
              }}
            >
              リセット
            </Button>
            <Button
              type="submit"
              form="forgot-password-form"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "送信中..." : "送信する"}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
