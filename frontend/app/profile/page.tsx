"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMyAccounts } from "@/features/accounts/api";
import type { Account } from "@/features/accounts/types";
import { getTransactionsByAccount } from "@/features/transaction/api";
import type { Transaction } from "@/features/transaction/types";
import { getMe, uploadProfilePicture } from "@/features/users/api";
import type { User } from "@/features/users/types";
import { Button } from "@/components/ui/button";

const formatDate = (value?: string) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const formatCurrency = (amount?: number, currency = "JPY") => {
  if (amount === undefined || amount === null) return "-";

  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency,
  }).format(amount);
};

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const profilePictureInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");
  const [pictureMessage, setPictureMessage] = useState("");
  const [pictureError, setPictureError] = useState("");
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [userResponse, accountsResponse] = await Promise.all([
          getMe(),
          getMyAccounts(),
        ]);

        const nextUser = userResponse.data ?? null;
        const nextAccounts = accountsResponse.data ?? [];
        const primaryAccount = nextAccounts[0];

        setUser(nextUser);
        setAccounts(nextAccounts);

        if (primaryAccount) {
          const transactionResponse = await getTransactionsByAccount(
            primaryAccount.accountNumber,
            0,
            5,
          );
          setTransactions(transactionResponse.data ?? []);
        }
      } catch {
        setError("プロフィールの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleProfilePictureChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.currentTarget.files?.[0];
    if (!selectedFile) return;

    setPictureError("");
    setPictureMessage("");
    setUploadingPicture(true);

    try {
      await uploadProfilePicture(selectedFile);
      const response = await getMe();
      setUser(response.data ?? null);
      setPictureMessage("プロフィール画像を更新しました");
    } catch {
      setPictureError("プロフィール画像の更新に失敗しました");
    } finally {
      setUploadingPicture(false);
      event.currentTarget.value = "";
    }
  }

  const primaryAccount = accounts[0];
  const accountType = primaryAccount?.accountType;

  return (
    <div className="flex flex-1 justify-center px-4 py-12">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>プロフィール</CardTitle>
            <CardDescription>
              ログイン中のアカウント情報を確認できます。
            </CardDescription>
          </CardHeader>

          <CardContent>
            {loading && (
              <p className="text-sm text-muted-foreground">読み込み中...</p>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            {user && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-full bg-muted text-xl font-semibold">
                    {user.profilePictureUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.profilePictureUrl}
                        alt="プロフィール画像"
                        className="size-16 rounded-full object-cover"
                      />
                    ) : (
                      <span>{user.firstName?.charAt(0) ?? "U"}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {[user.lastName, user.firstName]
                        .filter(Boolean)
                        .join(" ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                <section className="space-y-3">
                  <h2 className="text-sm font-medium">個人情報</h2>
                  <dl className="space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">電話番号</dt>
                      <dd className="font-medium">{user.phoneNumber || "-"}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">ステータス</dt>
                      <dd className="font-medium">
                        {user.active ? "有効" : "無効"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">作成日</dt>
                      <dd className="font-medium">
                        {formatDate(user.createdAt)}
                      </dd>
                    </div>
                  </dl>
                </section>

                <section className="space-y-3">
                  <h2 className="text-sm font-medium">プロフィール画像</h2>
                  <div className="space-y-3">
                    {/* Profile image changes upload immediately after file selection. */}
                    <input
                      ref={profilePictureInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                    />
                    <Button
                      type="button"
                      onClick={() => profilePictureInputRef.current?.click()}
                      disabled={uploadingPicture}
                    >
                      {uploadingPicture ? "更新中..." : "画像を変更"}
                    </Button>
                    {pictureMessage && (
                      <p className="text-sm text-muted-foreground">
                        {pictureMessage}
                      </p>
                    )}
                    {pictureError && (
                      <p className="text-sm text-destructive">{pictureError}</p>
                    )}
                  </div>
                </section>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>パスワード変更</CardTitle>
            <CardDescription>
              パスワード変更ページへ移動します。
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button asChild>
              <Link href="/change-password">パスワードを変更する</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>普通預金口座</CardTitle>
            <CardDescription>
              メイン口座のステータスと残高です。
            </CardDescription>
          </CardHeader>

          <CardContent>
            {primaryAccount ? (
              <dl className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">口座種別</dt>
                  <dd className="font-medium">{accountType ?? "-"}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">口座番号</dt>
                  <dd className="font-medium">
                    {primaryAccount.accountNumber}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">残高</dt>
                  <dd className="font-medium">
                    {formatCurrency(
                      primaryAccount.balance,
                      primaryAccount.currency,
                    )}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">ステータス</dt>
                  <dd className="font-medium">{primaryAccount.status}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">作成日</dt>
                  <dd className="font-medium">
                    {formatDate(primaryAccount.createdAt)}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">
                口座情報がありません。
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近の取引</CardTitle>
            <CardDescription>直近5件の取引履歴です。</CardDescription>
          </CardHeader>

          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => {
                  const transactionType = transaction.transactionType;

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {transaction.description || transactionType}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(transaction.transactionDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatCurrency(
                            transaction.amount,
                            primaryAccount?.currency,
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                最近の取引はありません。
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
