
import { MobileNavigationHeader } from "../base-components/mobile-header";
import { NavAccountCard } from "../base-components/nav-account-card";
import { NavItemBase } from "../base-components/nav-item";
import type { NavItemType } from "../config";
import { Search } from "@/components/base/search/search";

import { Button } from "@/components/base/buttons/button";
import { PlusCircle } from "@untitledui-pro/icons/solid";
import React, { useState } from "react";
import { InpartLogo } from "@/components/foundations/logo/inpart-logo";
import { InpartLogoMinimal } from "@/components/foundations/logo/inpart-logo-minimal";
import { Avatar } from "@/components/base/avatar/avatar";


interface SidebarNavigationSectionsSubheadingsProps {
/** URL of the currently active item. */
activeUrl?: string;
/** List of items to display. */
items: Array<{ label: string; items: NavItemType[] }>;
    }

    export const SidebarNavigationSectionsSubheadings = ({ activeUrl = "/", items }:
    SidebarNavigationSectionsSubheadingsProps) => {
    const [expanded, setExpanded] = useState(false);
    const MAIN_SIDEBAR_WIDTH = 292;
    const COLLAPSED_WIDTH = 80;
    const EXPANDED_WIDTH = MAIN_SIDEBAR_WIDTH;

    const sidebarWidth = expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH;

    // Selected account for avatar display
    const selectedAccount = {
        name: "Linh Nguyen",
        email: "linh.nguyen.com",
        avatar: "/images/my-notion-face-portrait.png",
        status: "online" as const,
    };


    const content = (
    <aside onMouseEnter={()=> setExpanded(true)} onMouseLeave={() => setExpanded(false)}


        style={{ "--width": `${sidebarWidth}px`, width: sidebarWidth, transition: "width 0.3s ease-in-out" } as React.CSSProperties }



        className="flex h-full w-full max-w-full flex-col justify-between overflow-hidden border-secondary bg-primary pt-4 shadow-xs md:border-r lg:w-(--width) lg:rounded-xl lg:border lg:pt-5">

        {/* TOP SECTION */}
        
      
        <div className="top flex flex-col gap-5 px-4 bg-primary shrink-0">
              {/* Logo */}
            <div className="h-8 flex items-center overflow-visible">
              <div className="relative w-full h-8 flex items-center">
                {/* Minimal logo - always positioned at left */}
                <div className="absolute left-0 w-8 h-8 transition-opacity" style={{ opacity: expanded ? 0 : 1, pointerEvents: expanded ? 'none' : 'auto' }}>
                  <InpartLogoMinimal className="h-8 w-8" />
                </div>
                {/* Full logo - fills width when expanded */}
                <div className="w-full h-8 transition-opacity duration-300" style={{ opacity: expanded ? 1 : 0, pointerEvents: expanded ? 'auto' : 'none' }}>
                  <InpartLogo className="h-8" />
                </div>
              </div>
            </div>

            
 {/* Search */}

            <div className="h-10 flex items-center justify-center">
              {expanded ? (
                <Search
                  placeholder="Quick search"
                  size="sm"
                  className="w-full transition-all duration-300"
                />
              ) : (
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary hover:bg-secondary transition-all duration-300">
                  <svg className="h-5 w-5 text-quaternary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>
              )}
            </div>
        </div>

        {/* Center section */}
        <div className="navitems flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-tertiary [&::-webkit-scrollbar-thumb]:rounded-full">
            <ul className="mt-4">
                {items.map((group) => (
                <li key={group.label}>
                    <div className="h-8 flex items-start pt-2 pb-1 px-4">
                      <p className={expanded ? "text-xs font-semibold text-quaternary uppercase transition-opacity duration-300 opacity-100" : "text-xs font-semibold text-quaternary uppercase transition-opacity duration-300 opacity-0 pointer-events-none"}>
                        {group.label}
                      </p>
                    </div>
                    <ul className="px-4 pb-5">
                        {group.items.map((item) => (
                        <li key={item.label} className="py-0.5">
                     <NavItemBase
  icon={item.icon}
  href={item.href}
 badge={expanded ? item.badge : undefined} 
  type="link"
  current={item.href === activeUrl}
  iconOnly={ !expanded }
>
  {expanded && item.label}
</NavItemBase>

                        </li>
                        ))}
                    </ul>
                </li>
                ))}
            </ul>

        </div>

        {/* Bottom section */}
        <div className="bottom bg-primary shrink-0">
            {/* Button */}
            <div className={expanded ? "py-4 px-4" : "py-4 px-4 flex justify-center"}>
                <Button size="lg"
  className={
    expanded
      ? "w-full justify-start pl-4 transition-all duration-300"
      : "w-12 h-12 p-0 justify-center transition-all duration-300"
  }
  iconLeading={PlusCircle}
>
  {expanded && "Create"}
</Button>
            </div>

            {/* Bottom account card */}
            <div className= "mt-auto flex px-4 py-4 border-t border-secondary ">
                {expanded ? (
                  <NavAccountCard />
                ) : (
                  <div className="mx-auto h-14 w-24 flex items-center justify-center">
                    <Avatar
                      size="md"
                      src={selectedAccount.avatar}
                      status={selectedAccount.status}
                    />
                  </div>
                )}
            </div>

        </div>
    </aside>
    );

    return (
    <>
        {/* Mobile header navigation */}
        <MobileNavigationHeader>{content}</MobileNavigationHeader>

        {/* Desktop sidebar navigation */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:py-1 lg:pl-1">{content}</div>

        {/* Placeholder to take up physical space because the real sidebar has `fixed` position. */}
        <div style={{
                    paddingLeft: sidebarWidth + 4,
                    transition: "padding-left 0.3s ease-in-out",
                }} className="invisible hidden lg:sticky lg:top-0 lg:bottom-0 lg:left-0 lg:block" />
        </>
        );
        };