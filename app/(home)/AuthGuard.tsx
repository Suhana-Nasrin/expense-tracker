import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { BudgetProvider } from "@/context/BudgeContext";
import { ExpenseProvider } from "@/context/ExpenseContext";

export default async function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <BudgetProvider>
      <ExpenseProvider>
        <div className="flex min-h-screen bg-slate-50">
          <Sidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </ExpenseProvider>
    </BudgetProvider>
  );
}
