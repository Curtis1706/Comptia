"use client";

import React from "react";

import {
  Bell,
  Menu,
  Search,
  Plus,
  User as UserIcon,
  LogOut,
  Settings as SettingsIcon,
  CreditCard,
  Check,
  Info,
  AlertTriangle,
  XCircle,
  Crown,
  Shield,
  BookOpen,
  Receipt,
  Users,
  Award,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "./GlobalSearch";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ROLE_LABELS, UserRole } from "@/lib/permissions";
import { usePermissions } from "@/hooks/usePermissions";

const ROLE_HEADER_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; badgeCls: string }
> = {
  owner: {
    label: "Propriétaire",
    icon: Crown,
    badgeCls: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  admin: {
    label: "Administrateur",
    icon: Shield,
    badgeCls: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
  },
  accountant: {
    label: "Comptable",
    icon: BookOpen,
    badgeCls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  cashier: {
    label: "Caissier",
    icon: Receipt,
    badgeCls: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
  },
  hr: {
    label: "Ressources Humaines",
    icon: Users,
    badgeCls: "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30",
  },
  expert: {
    label: "Expert-comptable",
    icon: Award,
    badgeCls: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  viewer: {
    label: "Observateur",
    icon: Eye,
    badgeCls: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30",
  },
};

const titles: Record<string, string> = {
  "/": "Tableau de bord",
  "/comptabilite": "Comptabilité",
  "/facturation": "Facturation",
  "/tva": "Gestion TVA",
  "/paie": "Paie",
  "/reporting": "Reporting",
  "/documents": "Documents",
  "/parametres": "Configuration",
};

const notifIcons = {
  info: <Info className="h-4 w-4 text-blue-500" />,
  success: <Check className="h-4 w-4 text-green-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  error: <XCircle className="h-4 w-4 text-red-500" />,
};

interface Props {
  onOpenSidebar: () => void;
}

export const AppHeader = ({ onOpenSidebar }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasAccess } = usePermissions();
  const title = titles[pathname] ?? "Comptia";

  const { data: user, isLoading: userLoading } = useQuery<any>({
    queryKey: ["me"],
    queryFn: () => fetcher("/api/auth/me"),
  });

  const { data: company, isLoading: companyLoading } = useQuery<any>({
    queryKey: ["company"],
    queryFn: () => fetcher("/api/company"),
  });

  const { data: notifData, isLoading: notifsLoading } = useQuery<any>({
    queryKey: ["notifications"],
    queryFn: () => fetcher("/api/notifications"),
    refetchInterval: 30000, // Refresh every 30s
  });

  const notifications = notifData?.notifications || [];
  const unreadCount = notifData?.unreadCount || 0;

  const initials = user?.name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() || "??";
  const userRole = (user?.role as UserRole) || "viewer";
  const roleInfo = ROLE_HEADER_CONFIG[userRole] || {
    label: ROLE_LABELS[userRole] || userRole || "Membre",
    icon: Shield,
    badgeCls: "bg-muted text-muted-foreground border-border",
  };
  const RoleIcon = roleInfo.icon;

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (e) {
      console.error(e);
    }
  };

  const [searchOpen, setSearchOpen] = React.useState(false);

  const canCreateInvoice = hasAccess("invoices");
  const canAccessSettings =
    hasAccess("company_settings") ||
    hasAccess("chart_of_accounts") ||
    hasAccess("user_management") ||
    hasAccess("mecef_settings");
  const canAccessBilling = hasAccess("subscription_billing") || userRole === "owner";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-xl lg:px-8">
      <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />
      
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenSidebar} aria-label="Ouvrir la navigation">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden flex-col md:flex">
        <p className="text-xs text-muted-foreground">
          Comptia / {companyLoading ? "..." : company?.name || "Espace Client"}
        </p>
        <h1 className="font-display text-lg font-semibold leading-tight text-foreground">{title}</h1>
      </div>

      <div className="ml-auto flex items-center gap-2 lg:gap-3">
        <button 
          onClick={() => setSearchOpen(true)}
          className="relative hidden h-9 w-64 items-center gap-2 rounded-lg border border-border bg-secondary px-3 text-sm text-muted-foreground transition hover:bg-muted md:flex lg:w-72"
        >
          <Search className="h-4 w-4" />
          <span>Rechercher...</span>
          <kbd className="pointer-events-none absolute right-2 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        {canCreateInvoice && (
          <Button 
            size="sm" 
            className="hidden bg-gradient-primary shadow-sm hover:opacity-90 sm:inline-flex"
            onClick={() => router.push("/facturation?action=new")}
          >
            <Plus className="mr-1 h-4 w-4" />
            Nouvelle facture
          </Button>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9 text-foreground/70 transition-colors hover:bg-muted hover:text-foreground" 
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" strokeWidth={2.5} />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white ring-2 ring-card shadow-sm">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="z-50 mt-2 w-[calc(100vw-2rem)] border-border bg-card p-0 shadow-elevated sm:w-96" 
            align="end"
            sideOffset={8}
          >
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:underline"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>
            <ScrollArea className="h-[400px] max-h-[60vh] sm:h-96">
              {notifications.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center p-4 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Aucune notification pour le moment.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((n: any) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        if (n.link) router.push(n.link);
                      }}
                      className={cn(
                        "flex w-full gap-3 p-4 text-left transition hover:bg-muted/50",
                        !n.is_read && "bg-primary-soft/30"
                      )}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notifIcons[n.type as keyof typeof notifIcons] || notifIcons.info}
                      </div>
                      <div className="flex-1 space-y-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <p className={cn("truncate text-sm font-semibold", !n.is_read && "text-primary")}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: fr })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
            <div className="border-t p-2 text-center">
              <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => router.push("/notifications")}>
                Voir toutes les notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* User Profile Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative flex h-10 items-center gap-2.5 rounded-full border border-border bg-secondary p-1 pr-3 transition hover:bg-muted">
              {userLoading ? (
                <Skeleton className="h-8 w-8 rounded-full" />
              ) : (
                <Avatar className="h-8 w-8 border border-border shadow-sm">
                  <AvatarImage src={user?.avatar_url} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-primary text-[10px] font-bold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="hidden text-left lg:block">
                {userLoading ? (
                  <Skeleton className="h-3 w-20" />
                ) : (
                  <>
                    <p className="text-xs font-semibold leading-tight text-foreground">{user?.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <RoleIcon className="h-3 w-3 text-muted-foreground" />
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{roleInfo.label}</p>
                    </div>
                  </>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-3 bg-muted/30">
              <div className="flex flex-col space-y-1.5">
                <p className="text-sm font-semibold leading-none text-foreground">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                <div className="pt-1">
                  <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", roleInfo.badgeCls)}>
                    <RoleIcon className="h-3 w-3" />
                    {roleInfo.label}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/parametres")} className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Mon profil & Compte</span>
              </DropdownMenuItem>
              {canAccessBilling && (
                <DropdownMenuItem onClick={() => router.push("/parametres?tab=billing")} className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Facturation Studio</span>
                </DropdownMenuItem>
              )}
              {canAccessSettings && (
                <DropdownMenuItem onClick={() => router.push("/parametres")} className="cursor-pointer">
                  <SettingsIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Paramètres de l'entreprise</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer font-medium"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Direct Logout Icon Button in Header for fast 1-click access */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          title="Déconnexion directe"
          aria-label="Se déconnecter"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};