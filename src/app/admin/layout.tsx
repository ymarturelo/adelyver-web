import AdminGuard from "../__components/AdminGuard";
import AuthGuard from "../__components/AuthGuard";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AdminGuard>{children}</AdminGuard>
    </AuthGuard>
  );
}
