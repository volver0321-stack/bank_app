"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/features/auth_users/api";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!code) {
      setError("再設定コードが見つかりません");
      return;
    }

    if (!newPassword) {
      setError("新しいパスワードを入力してください");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("確認用パスワードが一致しません");
      return;
    }

    setSubmitting(true);

    try {
      await resetPassword({
        code,
        newPassword,
      });
      setNewPassword("");
      setConfirmPassword("");
      setMessage("パスワードを再設定しました");
      router.push("/login");
    } catch {
      setError("パスワードの再設定に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>パスワード再設定</CardTitle>
          <CardDescription>
            メールで届いたリンクから新しいパスワードを設定します。
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id="reset-password-form" className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="reset-code" className="text-sm font-medium">
                再設定コード
              </label>
              <Input id="reset-code" value={code} readOnly />
            </div>

            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-medium">
                新しいパスワード
              </label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="text-sm font-medium"
              >
                新しいパスワード（確認）
              </label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>

            {message && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </form>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button asChild variant="outline">
            <Link href="/login">ログインへ戻る</Link>
          </Button>
          <Button
            type="submit"
            form="reset-password-form"
            disabled={submitting || !code}
          >
            {submitting ? "再設定中..." : "再設定する"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
