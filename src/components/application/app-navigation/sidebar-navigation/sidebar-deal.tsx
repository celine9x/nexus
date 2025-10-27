import { SidebarNavigationSectionsSubheadings } from "./sidebar-sections-subheadings";
import { Home02, CheckDone01, File05, PieChart03, Rows01 } from "@untitledui/icons";
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
        icon: HomeIcon,
      },
      {
        label: "Dashboard",
        href: "/projects",
        icon: ChartBarIcon,
      },
      {
        label: "Network",
        href: "/documents",
        icon: ShareIcon,
      },
  
    ],
  },
 
  {
    label: "Workspace",
    items: [
      {
        label: "Initiatives",
        href: "#",
        icon: FolderIcon,
      },
      {
        label: "Opportunities",
        href: "/opportunity",
        icon: DocumentIcon,
        badge: (
          <Badge size="sm" type="modern">
            8
          </Badge>
        ),
      },
      {
        label: "Alliances",
        href: "/alliance",
        icon: HandshakeIcon,
      },
      {
        label: "Agreements",
        href: "/agreement",
        icon: AgreementIcon,
      },
          {
        label: "Obligations",
        href: "/obligation",
        icon: ScrollIcon,
      },
    ],
  },

  {
    label: "Directory",
    items: [
      {
        label: "Companies",
        href: "#",
        icon: BuildingOfficeIcon,
      },
      {
        label: "Contacts",
        href: "#",
        icon: UserIcon,
  
      },
            {
        label: "Meetings",
        href: "#",
        icon: CalendarIcon,
  
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
