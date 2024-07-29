import { CircleUser, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function AdminDashboardLayout() {
  const location = useLocation();
  const { logout } = useAuth();

  console.log(location.pathname);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            to="#"
            className="scale-125 h-12 w-12 flex items-center justify-center"
          >
            <img src="/Mikronet.png" alt="Mikronet" />

            <span className="sr-only">Mikronet</span>
          </Link>
          <Link
            to="/admin/home"
            className={` transition-colors hover:text-foreground
            ${location.pathname === "/admin/home" ? "text-foreground " : "text-muted-foreground"} `}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/orders"
            className={` transition-colors hover:text-foreground
            ${location.pathname === "/admin/orders" ? "text-foreground " : "text-muted-foreground"} `}
          >
            Orders
          </Link>
          <Link
            to="/admin/products"
            className={` transition-colors hover:text-foreground
            ${location.pathname === "/admin/products" ? "text-foreground " : "text-muted-foreground"} `}
          >
            Products
          </Link>
          <Link
            to="/admin/customers"
            className={` transition-colors hover:text-foreground
            ${location.pathname === "/admin/customers" ? "text-foreground " : "text-muted-foreground"} `}
          >
            Customers
          </Link>
          <Link
            to="/admin/analytics"
            className={` transition-colors hover:text-foreground
            ${location.pathname === "/admin/analytics" ? "text-foreground " : "text-muted-foreground"} `}
          >
            Analytics
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                to="#"
                className="scale-125 h-12 w-12 flex items-center justify-center"
              >
                <img src="/Mikronet.png" alt="Mikronet" />

                <span className="sr-only">Mikronet</span>
              </Link>
              <Link
                to="/admin/home"
                className={`  hover:text-foreground
            ${location.pathname === "/admin/home" ? "text-foreground " : "text-muted-foreground"} `}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/orders"
                className={`  hover:text-foreground
            ${location.pathname === "/admin/orders" ? "text-foreground " : "text-muted-foreground"} `}
              >
                Orders
              </Link>
              <Link
                to="/admin/products"
                className={`  hover:text-foreground
            ${location.pathname === "/admin/products" ? "text-foreground " : "text-muted-foreground"} `}
              >
                Products
              </Link>
              <Link
                to="/admin/customers"
                className={`  hover:text-foreground
            ${location.pathname === "/admin/customers" ? "text-foreground " : "text-muted-foreground"} `}
              >
                Customers
              </Link>
              <Link
                to="/admin/analytics"
                className={`  hover:text-foreground
            ${location.pathname === "/admin/analytics" ? "text-foreground " : "text-muted-foreground"} `}
              >
                Analytics
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customer..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/admin/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
