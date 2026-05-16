"use client";

import Link from "next/link";
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
import { updatePassword } from "@/features/users/api";

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!oldPassword || !newPassword) {
      setError("現在のパスワードと新しいパスワードを入力してください");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("確認用パスワードが一致しません");
      return;
    }

    setSubmitting(true);

    try {
      await updatePassword({
        oldPassword,
        newPassword,
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("パスワードを変更しました");
    } catch {
      setError("パスワードの変更に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>パスワード変更</CardTitle>
          <CardDescription>
            現在のパスワードを確認して新しいパスワードに変更します。
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id="change-password-form" className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="old-password" className="text-sm font-medium">
                現在のパスワード
              </label>
              <Input
                id="old-password"
                type="password"
                autoComplete="current-password"
                value={oldPassword}
                onChange={(event) => setOldPassword(event.target.value)}
              />
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
            <Link href="/profile">プロフィールへ戻る</Link>
          </Button>
          <Button
            type="submit"
            form="change-password-form"
            disabled={submitting}
          >
            {submitting ? "変更中..." : "変更する"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;
