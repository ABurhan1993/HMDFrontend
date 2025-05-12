import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  GridIcon,
  ChevronDownIcon,
  HorizontaLDots,
  UserCircleIcon,
  PlugInIcon,
  DocsIcon,
  RulerIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useUser } from "@/hooks/useUser";
import hmdLogo from "@/assets/hmd-pdf.png";

const navItems = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Dashboard Home", path: "/", pro: false, requiredPermission: "" }],
  },
  {
    icon: <UserCircleIcon />,
    name: "Customers",
    subItems: [{ name: "Customers", path: "/customers", pro: false, requiredPermission: "Permissions.Customers.View" }],
  },
  {
    icon: <DocsIcon />,
    name: "Inquiries",
    subItems: [{ name: "Inquiry List", path: "/inquiries", pro: false, requiredPermission: "Permissions.Inquiries.View" }],
  },
  {
    icon: <RulerIcon />,
    name: "Measurement",
    subItems: [
      {
        name: "Assignment Requests",
        path: "/measurement/assignment-requests",
        pro: false,
        requiredPermission: "Permissions.Measurements.View",
      },
      // ممكن نضيف لاحقًا:
      // { name: "Measurement Tasks", path: "/measurement/tasks", requiredPermission: ... },
      // { name: "Approval", path: "/measurement/approval", requiredPermission: ... },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Settings",
    subItems: [
      { name: "User List", path: "/users", pro: false, requiredPermission: "Permissions.Users.View" },
      { name: "Role List", path: "/roles", pro: false, requiredPermission: "Permissions.Roles.View" },
    ],
  },
  
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const user = useUser();

  const [openSubmenu, setOpenSubmenu] = useState<{ index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    navItems.forEach((nav, index) => {
      nav.subItems?.forEach((subItem) => {
        if (isActive(subItem.path)) {
          setOpenSubmenu({ index });
        }
      });
    });
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `submenu-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => (prev?.index === index ? null : { index }));
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col top-0 px-5 left-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-white h-screen transition-all duration-300 z-50 border-r border-gray-200 dark:border-gray-700 ${
        isExpanded || isHovered || isMobileOpen ? "w-[290px]" : "w-[90px]"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="py-8">
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-2">
              <img src={hmdLogo} alt="HMD Logo" width={36} className="rounded-sm" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">HMD CRM</span>
            </div>
          ) : (
            <img src={hmdLogo} alt="HMD Logo" width={32} className="rounded-sm" />
          )}
        </Link>
      </div>

      <nav className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
        <h2 className="mb-4 text-xs uppercase text-gray-400 dark:text-gray-500">
          {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
        </h2>
        <ul className="flex flex-col gap-4">
          {navItems.map((nav, index) => {
            const visibleSubItems = nav.subItems.filter(
              (subItem) =>
                !subItem.requiredPermission ||
                user?.permissions.includes(subItem.requiredPermission)
            );

            if (visibleSubItems.length === 0) {
              console.warn("No visible items for:", nav.name, "User permissions:", user?.permissions);
              return null;
            } // 🔥 اخفي القسم إذا لا يملك أي صلاحية

            return (
              <li key={nav.name}>
                <button
                  onClick={() => handleSubmenuToggle(index)}
                  className="flex items-center w-full gap-2 text-gray-700 dark:text-gray-300 hover:text-brand-500"
                >
                  {nav.icon}
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <>
                      <span>{nav.name}</span>
                      <ChevronDownIcon
                        className={`ml-auto w-5 h-5 transition-transform ${
                          openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""
                        }`}
                      />
                    </>
                  )}
                </button>

                <div
                  ref={(el) => {
                    subMenuRefs.current[`submenu-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height: openSubmenu?.index === index ? subMenuHeight[`submenu-${index}`] : 0,
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {visibleSubItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          className={`block py-1 text-gray-600 dark:text-gray-300 hover:text-brand-500 ${
                            isActive(subItem.path) ? "text-brand-500 font-bold" : ""
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default AppSidebar;
