import { Suspense } from "react";
import DashboardClient from "./DashboardClient";
import { Skeleton } from "@/components/Skeleton";
import { fetchAllProperties } from "@/lib/data";

export const metadata = { title: "Dashboard — RuangKita" };

async function Content() {
  return <DashboardClient properties={await fetchAllProperties()} />;
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl space-y-4 px-5 py-16">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      }
    >
      <Content />
    </Suspense>
  );
}
