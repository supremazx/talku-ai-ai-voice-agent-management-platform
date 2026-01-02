import React from "react";
import {
  LayoutDashboard,
  Bot,
  Hash,
  History,
  CreditCard,
  Settings,
  Mic,
  ChevronDown
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
const items = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/app" },
  { title: "AI Agents", icon: Bot, url: "/app/agents" },
  { title: "Numbers & Routing", icon: Hash, url: "/app/numbers" },
  { title: "Call Logs", icon: History, url: "/app/logs" },
  { title: "Billing", icon: CreditCard, url: "/app/billing" },
  { title: "Settings", icon: Settings, url: "/app/settings" },
];
export function SidebarCustomer(): JSX.Element {
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
                Talku<span className="text-orange-600">AI</span>
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Voice Platform</span>
            </div>
          </div>
          <div className="mt-4 px-2 group-data-[collapsible=icon]:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium bg-muted/50 rounded-md border border-border/50 hover:bg-muted transition-colors">
                  <span className="truncate">Acme Corp</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="start">
                <DropdownMenuItem>Switch Workspace</DropdownMenuItem>
                <DropdownMenuItem>Team Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Credits</p>
            <p className="text-sm font-bold">$124.50</p>
            <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
              <div className="w-3/4 h-full bg-orange-500" />
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}