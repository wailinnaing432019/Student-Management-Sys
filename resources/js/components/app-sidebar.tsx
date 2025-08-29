import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  UserRoundCog,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { title } from "process"
import { usePage } from "@inertiajs/react"
import { SharedData } from "@/types"



const data = {
  user: {
    name: "မောင်", // mg
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "ကွန်ပျူတာတက္ကသိုလ်", // This is likely an acronym, so keeping it as is.
      logo: "/storage/logos/icon.png",
      plan: "(မိတ္ထီလာ)", // Enterprise
    },

  ],
  navMain: [
    {
      title: "ကျောင်းသားအချက်အလက်", // Students
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "ရှာဖွေရန်", // View
          url: "/students",
        },
        {
          title: "ကျောင်းအပ်ထားသူများ", // Enrolled Students
          url: "/enroll-students",
        },
        {
          title: "အသစ်ထည့်မည်", // Create
          url: "/enroll-students/create",
        },
        {
          title: "အမှတ်များ", // Marks
          url: "/marks/show"
        }
      ],
    },
    {
      title: "ပညာရေး", // Academic
      url: "#",
      icon: Bot,
      items: [
        {
          title: "ပညာသင်နှစ်", // Academic Year
          url: "/academic-years",
        },
        {
          title: "သင်တန်းကာလများ", // Semesters
          url: "/semesters",
        },
        {
          title: "အထူးပြုဘာသာရပ်များ", // Majors
          url: "/majors"
        },
        {
          title: "သင်ကြားမည့် ဘာသာရပ်များ", // Courses
          url: "/courses",
        },
        {
          title: "သင်တန်းကာလ နှင့် ဘာသာရပ်များ", // Semester-Courses
          url: "/course-semesters"
        }
      ],
    },
    {
      title: "ချိန်ညှိမှုများ", // Settings
      url: "#",
      icon: UserRoundCog,
      items: [
        {
          title: "ပရိုဖိုင်", // Profile
          url: "/settings/profile",
        },
        {
          title: "စကားဝှက်", // Password
          url: "/settings/password",
        },
      ],
    },
  ],
  navStaff: [
    {
      title: "ကျောင်းသားအချက်အလက်", // Students
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "ရှာဖွေရန်", // View
          url: "/students",
        },
        {
          title: "ကျောင်းအပ်ထားသူများ", // Enrolled Students
          url: "/enroll-students",
        },
        {
          title: "အသစ်ထည့်မည်", // Create
          url: "/enroll-students/create",
        }
      ],
    },
    {
      title: "ပညာရေး", // Academic
      url: "#",
      icon: Bot,
      items: [
        {
          title: "ပညာသင်နှစ်", // Academic Year
          url: "/academic-years",
        },
        {
          title: "သင်တန်းကာလများ", // Semesters
          url: "/semesters",
        },
        {
          title: "အထူးပြုဘာသာရပ်များ", // Majors
          url: "/majors"
        },
        {
          title: "သင်ကြားမည့် ဘာသာရပ်များ", // Courses
          url: "/courses",
        },
        {
          title: "သင်တန်းကာလ နှင့် ဘာသာရပ်များ", // Semester-Courses
          url: "/course-semesters"
        }
      ],
    },
    {
      title: "ချိန်ညှိမှုများ", // Settings
      url: "#",
      icon: UserRoundCog,
      items: [
        {
          title: "ပရိုဖိုင်", // Profile
          url: "/settings/profile",
        },

        {
          title: "စကားဝှက်", // Password
          url: "/settings/password",
        },

      ],
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { auth } = usePage<SharedData>().props;

  const userRole = auth?.user?.role || 'staff';

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {userRole == "admin" && <NavMain items={data.navMain} />}
        {userRole == "staff" && <NavMain items={data.navStaff} />}

        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: auth.user.name, email: auth.user.email, avatar: '/avatars/shadcn.jpg' }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
