// Layout del admin — no hereda Navbar/Footer del grupo (public).
// El panel admin tiene su propio header interno en app/admin/page.tsx.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
