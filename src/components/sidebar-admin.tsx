import React from "react";
import {
  LayoutDashboard,
  Building2,
  ListChecks,
  BarChart3,
  WalletCards,
  Network,
  Activity,
  ShieldAlert,
  Fingerprint,
  Settings,
  Mic,
  BadgeAlert
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
const items = [
  { title: "Overview", icon: LayoutDashboard, url: "/admin" },
  { title: "Tenants", icon: Building2, url: "/admin/tenants" },
  { title: "Global Calls", icon: ListChecks, url: "/admin/logs" },
  { title: "Usage & Costs", icon: BarChart3, url: "/admin/usage" },
  { title: "Billing Ops", icon: WalletCards, url: "/admin/billing" },
  { title: "System Health", icon: Activity, url: "/admin/health" },
  { title: "Audit Logs", icon: Fingerprint, url: "/admin/audit" },
  { title: "Settings", icon: Settings, url: "/admin/settings" },
];
export function SidebarAdmin(): JSX.Element {
  const location = useLocation();
  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader>
        <div className="flex flex-col gap-1 px-2 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white shadow-orange-500/20 shadow-lg">
              <Mic className="h-5 w-5" />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-lg font-bold tracking-tight text-foreground leading-none">
                Talku<span className="text-orange-600">Admin</span>
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Control Panel</span>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={location.pathname === item.url}
                  className={cn(
                    "transition-all duration-200 hover:bg-accent group",
                    location.pathname === item.url && "bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400 font-semibold"
                  )}
                >
                  <Link to={item.url}>
                    <item.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", location.pathname === item.url && "text-orange-600 dark:text-orange-400")} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 group-data-[collapsible=icon]:hidden">
          <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20">
            <div className="flex items-center gap-2">
              <BadgeAlert className="h-3 w-3 text-red-600" />
              <p className="text-xs font-bold text-red-600 uppercase">System Alert</p>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">2 Active Provider Incidents</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}