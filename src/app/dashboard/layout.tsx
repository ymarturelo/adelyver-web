import AuthGuard from "../__components/AuthGuard";
import ClientGuard from "../__components/ClientGuard";
import Navbar from "../admin/Navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Navbar />
      <ClientGuard>{children}</ClientGuard>
    </AuthGuard>
  );
}
