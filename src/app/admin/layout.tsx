import AdminGuard from "../__components/AdminGuard";
import AuthGuard from "../__components/AuthGuard";
import Navbar from "./Navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AdminGuard>
        <Navbar />
        {children}
      </AdminGuard>
    </AuthGuard>
  );
}
