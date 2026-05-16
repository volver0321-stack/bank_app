import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <section className="text-center">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          ページが見つかりません
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          URLが間違っているか、ページが移動した可能性があります。
        </p>

        <Button asChild className="mt-6">
          <Link href="/">トップへ戻る</Link>
        </Button>
      </section>
    </div>
  );
}

