import React from "react";
import { LayoutDashboard, Bot, Phone, ListChecks, CreditCard, Settings, Mic } from "lucide-react";
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
  { title: "Overview", icon: LayoutDashboard, url: "/" },
  { title: "AI Agents", icon: Bot, url: "/agents" },
  { title: "Numbers", icon: Phone, url: "/numbers" },
  { title: "Call Logs", icon: ListChecks, url: "/logs" },
  { title: "Billing", icon: CreditCard, url: "/billing" },
  { title: "Settings", icon: Settings, url: "/settings" },
];
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Mic className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
            Talku<span className="text-orange-500">.ai</span>
          </span>
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
                    "transition-colors hover:bg-accent",
                    location.pathname === item.url && "bg-accent text-accent-foreground font-semibold"
                  )}
                >
                  <Link to={item.url}>
                    <item.icon className="h-4 w-4" />
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
          <div className="rounded-lg bg-orange-500/10 p-4 border border-orange-500/20">
            <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Pro Plan</p>
            <p className="text-[10px] text-muted-foreground mt-1">Upgrade for more concurrency</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}