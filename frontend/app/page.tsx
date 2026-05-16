import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            Welcome to Bank App
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Bank App へようこそ
          </h1>
          <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground">
            口座情報、取引履歴、送金をひとつの画面から確認できます。
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/login">ログイン</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/register">新規登録</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
