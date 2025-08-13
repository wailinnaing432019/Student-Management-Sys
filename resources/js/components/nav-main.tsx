import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import { ChevronRight, HomeIcon, SquareTerminal } from "lucide-react";
import { useEffect, useState } from "react";

export function NavMain({ items }) {
  const { url } = usePage();

  // Track open menus by title
  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    const newOpenMenus = {};
    items.forEach((item) => {
      if (item.items?.some((sub) => url.startsWith(sub.url))) {
        newOpenMenus[item.title] = true;
      }
    });
    setOpenMenus((prev) => ({ ...prev, ...newOpenMenus }));
  }, [url]);

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Dashboard" isActive={url === "/dashboard"}>
            <Link href="/dashboard" className="flex items-center gap-2">
              <HomeIcon className="w-4 h-4" />
              <span>ပင်မစာမျက်နှာ</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {items.map((item) => {
          const isActive = url.startsWith(item.url);
          const isOpen = openMenus[item.title] || false;

          if (!item.items || item.items.length === 0) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={url.startsWith(item.url)}
                  tooltip={{ children: item.title }}
                >
                  <Link href={item.url} className="p-8">
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <SidebarMenuItem key={item.title}>
              <div className="group/collapsible">
                <SidebarMenuButton
                  tooltip={{ children: item.title }}
                  onClick={() => toggleMenu(item.title)}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight
                    className={`ml-auto transition-transform duration-200 ${isOpen ? "rotate-90" : ""
                      }`}
                  />
                </SidebarMenuButton>
                {isOpen && (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={url.startsWith(subItem.url)}
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </div>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
