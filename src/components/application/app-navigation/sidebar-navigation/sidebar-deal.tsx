import { SidebarNavigationSectionsSubheadings } from "./sidebar-sections-subheadings";
import { BarChartSquare02, Home02, CheckDone01, File05, PieChart03, Rows01, Users01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import type { NavItemType } from "@/components/application/app-navigation/config";
import { useLocation } from "react-router";


const navItemsWithSectionsSubheadings: Array<{ label: string; items: NavItemType[] }> = [
  {
    label: "Main",
    items: [
      {
        label: "Home",
        href: "/",
        icon: Home02,
      },
      {
        label: "Dashboard",
        href: "/projects",
        icon: Rows01,
      },
      {
        label: "Network",
        href: "/documents",
        icon: File05,
      },
  
    ],
  },
 
  {
    label: "Workspace",
    items: [
      {
        label: "Initiatives",
        href: "#",
        icon: PieChart03,
      },
      {
        label: "Opportunities",
        href: "/opportunity",
        icon: CheckDone01,
        badge: (
          <Badge size="sm" type="modern">
            8
          </Badge>
        ),
      },
      {
        label: "Alliances",
        href: "/alliance",
        icon: Users01,
      },
      {
        label: "Agreements",
        href: "/agreement",
        icon: Users01,
      },
          {
        label: "Obligations",
        href: "#",
        icon: Users01,
      },
    ],
  },

  {
    label: "Directory",
    items: [
      {
        label: "Companies",
        href: "#",
        icon: PieChart03,
      },
      {
        label: "Contacts",
        href: "#",
        icon: CheckDone01,
  
      },
            {
        label: "Meetings",
        href: "#",
        icon: CheckDone01,
  
      },
    ],
  },
  
  
];

const SidebarDeal = () => {
  const location = useLocation();

  return (
    <div className="sidebar w-max bg-secondary flex-start">
      <SidebarNavigationSectionsSubheadings
        items={navItemsWithSectionsSubheadings}
        activeUrl={location.pathname}
      />
    </div>
  );
};

export default SidebarDeal;
