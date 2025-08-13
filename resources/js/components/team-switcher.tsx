import * as React from "react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import AppearanceToggleIcon from "./ApperanceToggleIcon"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: string
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeTeam] = React.useState(teams[0])

  if (!activeTeam) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="flex items-center justify-between"
        >
          {/* Left: Team logo & info */}
          <div className="flex items-center gap-3">
            <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <img
                src={activeTeam.logo}
                alt={activeTeam.name}
                className="size-4 rounded"
              />
            </div>
            <div className="grid text-left text-sm leading-tight">
              <span className="truncate font-medium">{activeTeam.name}</span>
              <span className="truncate text-xs">{activeTeam.plan}</span>
            </div>
          </div>

          {/* Right: Single theme toggle icon */}
          <AppearanceToggleIcon />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
