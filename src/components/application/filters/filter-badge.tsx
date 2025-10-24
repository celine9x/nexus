import { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { Checkbox } from "@/components/base/checkbox/checkbox";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterBadgeProps {
  label: string;
  value: string | string[];
  options?: FilterOption[];
  selectedValues?: string[];
  onRemove: () => void;
  onEdit?: (values: string[]) => void;
  className?: string;
}

export const FilterBadge = ({
  label,
  value,
  options,
  selectedValues = [],
  onRemove,
  onEdit,
  className
}: FilterBadgeProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayValue = Array.isArray(value)
    ? value.length > 1
      ? `${value[0]} +${value.length - 1}`
      : value[0]
    : value;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handleToggle = (optionValue: string) => {
    if (!onEdit) return;

    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : [...selectedValues, optionValue];

    onEdit(newValues);
  };

  const handleSelectAll = () => {
    if (!onEdit || !options) return;

    if (selectedValues.length === options.length) {
      onEdit([]);
    } else {
      onEdit(options.map(opt => opt.value));
    }
  };

  const allSelected = options && selectedValues.length === options.length && options.length > 0;

  return (
    <div ref={dropdownRef} className={cx("relative inline-flex", className)}>
      <div
        className={cx(
          "inline-flex items-center gap-1.5 rounded-md bg-utility-brand-50 px-2.5 py-1 text-sm font-medium text-utility-brand-700 ring-1 ring-inset ring-utility-brand-200",
          options && onEdit && "cursor-pointer hover:bg-utility-brand-100 transition-colors"
        )}
        onClick={(e) => {
          if (options && onEdit) {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }
        }}
      >
        <span className="text-xs">
          {label}: <span className="font-semibold">{displayValue}</span>
        </span>
        {options && onEdit && (
          <ChevronDown className={cx(
            "size-3.5 text-utility-brand-500 transition-transform",
            isDropdownOpen && "rotate-180"
          )} />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 inline-flex items-center justify-center rounded hover:bg-utility-brand-200"
          aria-label={`Remove ${label} filter`}
        >
          <X className="size-3.5 text-utility-brand-500" />
        </button>
      </div>

      {/* Dropdown menu */}
      {isDropdownOpen && options && onEdit && (
        <div className="absolute top-full left-0 mt-1 z-50 w-64 rounded-lg bg-primary shadow-lg ring-1 ring-secondary_alt max-h-80 overflow-y-auto">
          <div className="flex flex-col gap-1 p-2">
            {/* Select all */}
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 px-2 py-1.5 text-left text-sm font-medium text-secondary hover:bg-primary_hover rounded-md transition-colors"
            >
              <Checkbox
                size="sm"
                isSelected={allSelected}
                isIndeterminate={selectedValues.length > 0 && !allSelected}
                onChange={handleSelectAll}
              />
              Select all
            </button>

            {/* Options */}
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleToggle(option.value)}
                className="flex items-center gap-2 px-2 py-1.5 text-left text-sm text-secondary hover:bg-primary_hover rounded-md transition-colors"
              >
                <Checkbox
                  size="sm"
                  isSelected={selectedValues.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                />
                <span className="truncate">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
