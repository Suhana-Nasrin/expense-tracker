
import { Suspense } from "react";
import AuthGuard from "./AuthGuard";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="p-6">Loading dashboard...</div>}>
      <AuthGuard>{children}</AuthGuard>
    </Suspense>
  );
}
