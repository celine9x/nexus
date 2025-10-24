import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "@untitledui/icons";
import { FilterBadge, type FilterOption } from "./filter-badge";
import { cx } from "@/utils/cx";

export interface ActiveFilter {
  key: string;
  label: string;
  value: string | string[];
  options?: FilterOption[];
  selectedValues?: string[];
}

export interface ActiveFiltersBarProps {
  filters: ActiveFilter[];
  onRemoveFilter: (key: string) => void;
  onEditFilter?: (key: string, values: string[]) => void;
  onClearAll: () => void;
  className?: string;
}

export const ActiveFiltersBar = ({ filters, onRemoveFilter, onEditFilter, onClearAll, className }: ActiveFiltersBarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (filters.length === 0) return null;

  return (
    <div className={cx("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-secondary">
            Active filters: <span className="text-tertiary">{filters.length}</span>
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 text-xs text-tertiary hover:text-secondary"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="size-3.5" />
                Hide
              </>
            ) : (
              <>
                <ChevronDown className="size-3.5" />
                Show
              </>
            )}
          </button>
        </div>
        <button
          onClick={onClearAll}
          className="inline-flex items-center gap-1 text-sm font-medium text-utility-error-700 hover:text-utility-error-800"
        >
          <X className="size-4" />
          Clear all
        </button>
      </div>

      {isExpanded && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <FilterBadge
              key={filter.key}
              label={filter.label}
              value={filter.value}
              options={filter.options}
              selectedValues={filter.selectedValues}
              onRemove={() => onRemoveFilter(filter.key)}
              onEdit={onEditFilter ? (values) => onEditFilter(filter.key, values) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};
