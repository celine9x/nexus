import React from "react";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { ChevronDown } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import type { BadgeColors } from "@/components/base/badges/badge-types";

export interface StatusOption<T extends string> {
  value: T;
  label: string;
  color: BadgeColors;
}

interface StatusBadgeDropdownProps<T extends string> {
  value: T;
  options: StatusOption<T>[];
  onChange: (newStatus: T) => void;
  disabled?: boolean;
}

export function StatusBadgeDropdown<T extends string>({
  value,
  options,
  onChange,
  disabled = false,
}: StatusBadgeDropdownProps<T>) {
  const currentOption = options.find((opt) => opt.value === value);

  if (!currentOption) return null;

  return (
    <Dropdown.Root>
      <button
        disabled={disabled}
        className={cx(
          "inline-flex items-center gap-1 outline-none",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        )}
      >
        <BadgeWithDot
          type="pill-color"
          size="sm"
          color={currentOption.color}
          className="capitalize"
        >
          {currentOption.label}
        </BadgeWithDot>
        {!disabled && (
          <ChevronDown className="size-3 text-tertiary" />
        )}
      </button>
      <Dropdown.Popover>
        <Dropdown.Menu>
          {options.map((option) => (
            <Dropdown.Item
              key={option.value}
              unstyled
              onAction={() => onChange(option.value)}
            >
              <div className="flex items-center gap-2 px-2.5 py-2 hover:bg-primary_hover rounded-md cursor-pointer">
                <BadgeWithDot
                  type="pill-color"
                  size="sm"
                  color={option.color}
                  className="capitalize"
                >
                  {option.label}
                </BadgeWithDot>
              </div>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  );
}
