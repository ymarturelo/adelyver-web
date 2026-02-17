import AuthGuard from "../__components/AuthGuard";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
