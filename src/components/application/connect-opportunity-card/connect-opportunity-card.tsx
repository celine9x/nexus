import React from "react";
import { CheckVerified03,Lightning01 } from "@untitledui-pro/icons/solid";
import { Beaker02,RefreshCcw02 } from "@untitledui/icons";
import { BadgeWithIcon } from "@/components/base/badges/badges";

interface ConnectOpportunityCardProps {
  imageSrc?: string;
  title: string;
  place: string;
  badgeText?: string;
  badgeIcon?: React.ComponentType<any>;
  children?: React.ReactNode;
  matched?: boolean;
  updated?: boolean;
}

const ConnectOpportunityCard: React.FC<ConnectOpportunityCardProps> = ({
  imageSrc="/images/University.jpg", // Default value
  title ="Connect Opportunity", // Default value
  place="University of California, San Francisco skqfjqsdfjqklsmjfkqlsdjflksdjfklsjqdkmljf", 
  badgeText = "Biopharma Asset", // Default value
   matched = true,   // default false
  updated = true,   // default fals
  children,
}) => (


  <div className="card border border-primary rounded-lg color-bg-primary p-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out cursor-pointer">
    
 <div className="relative image h-48 overflow-hidden flex items-center justify-center">
  {imageSrc && (
    <>
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "var(--color-brand-900)",
          opacity: 0.2,
          pointerEvents: "none"
        }}
      />
    </>
  )}
  <div className="badges absolute top-2 left-2 flex gap-2">
    {matched && (
  <BadgeWithIcon
    iconLeading={Lightning01}
    type="modern"
    size="md"
  >
   Matched
  </BadgeWithIcon>   )}
  
   {updated && (    
   <BadgeWithIcon
    iconLeading={RefreshCcw02}
    type="modern"
    size="md"
  >
   Updated
  </BadgeWithIcon>  )}
</div>
  
</div>


    <div className="info p-4 flex-col gap-2 bg-primary">
      <BadgeWithIcon
        iconLeading={Beaker02} 
        type="modern"
        size="md"
      >
        {badgeText} {/* ← Use the prop, not hardcoded "Verified" */}
      </BadgeWithIcon>
      
      <h3 className="title text-lg font-semibold text-primary md:text-lg line-clamp-2">
        {title} {/* ← Use the prop, not hardcoded title */}
      </h3>

      <div className="place flex items-center gap-1">
        <p className="text-sm text-secondary line-clamp-1">{place}</p> {/* ← Use the prop */}
        <CheckVerified03 className="icon text-brand-primary w-4 h-4" />
      </div>
      
      {children}
    </div>
  </div>
);

export default ConnectOpportunityCard;
