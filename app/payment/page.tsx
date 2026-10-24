import { Suspense } from "react";
import PaymentClient from "./PaymentClient";
import { Skeleton } from "@/components/Skeleton";

export const metadata = { title: "Pembayaran — RuangKita" };

export default function PaymentPage() {
  return (
    <div className="bg-paper">
      <Suspense fallback={<div className="mx-auto max-w-5xl px-5 py-16"><Skeleton className="h-96 w-full" /></div>}>
        <PaymentClient />
      </Suspense>
    </div>
  );
}
