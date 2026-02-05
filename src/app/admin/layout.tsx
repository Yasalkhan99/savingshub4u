import type { ReactNode } from "react";

/** Admin section: minimal layout so admin routes don’t depend on main app providers. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
