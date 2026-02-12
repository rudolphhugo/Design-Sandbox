"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { components, layouts, type RegistryItem } from "@/lib/registry";

interface SidebarProps {
  activeTab: "components" | "layouts";
}

export function Sidebar({ activeTab }: SidebarProps) {
  const pathname = usePathname();
  const items: RegistryItem[] = activeTab === "components" ? components : layouts;
  const basePath = activeTab === "components" ? "/components" : "/layouts";

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-sidebar h-full overflow-y-auto">
      <div className="p-6">
        <h1 className="text-lg font-semibold text-sidebar-foreground">
          Design Sandbox
        </h1>
        <p className="text-sm text-muted-foreground mt-1 capitalize">
          {activeTab}
        </p>
      </div>
      <nav className="px-3 pb-6">
        {items.length === 0 ? (
          <p className="px-3 py-2 text-sm text-muted-foreground">
            No {activeTab} yet
          </p>
        ) : (
          <ul className="space-y-1">
            {items.map((item) => {
              const href = `${basePath}/${item.slug}`;
              const isActive = pathname === href;
              return (
                <li key={item.slug}>
                  <Link
                    href={href}
                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </aside>
  );
}
