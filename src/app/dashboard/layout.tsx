import AuthGuard from "../__components/AuthGuard";
import ClientGuard from "../__components/ClientGuard";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <ClientGuard>{children}</ClientGuard>
    </AuthGuard>
  );
}
