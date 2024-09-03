import { Link, Outlet, useLocation } from "react-router-dom";

export const AdminSettingsView = () => {
  const location = useLocation();

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link
            to="general"
            className={`${location.pathname === "/admin/settings/general" ? "font-semibold text-primary" : ""}`}
          >
            General
          </Link>
          <Link
            to="alerting"
            className={`${location.pathname === "/admin/settings/alerting" ? "font-semibold text-primary" : ""}`}
          >
            Alerting
          </Link>
        </nav>
        <Outlet />
      </div>
    </main>
  );
};
