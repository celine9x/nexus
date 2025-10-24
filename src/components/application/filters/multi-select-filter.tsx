import { useState, useMemo } from "react";
import { SearchLg, ChevronLeft } from "@untitledui/icons";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface MultiSelectFilterProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  showBlankOption?: boolean;
  showSearch?: boolean;
  onBack?: () => void;
  className?: string;
}

export const MultiSelectFilter = ({
  title,
  options,
  selectedValues,
  onChange,
  showBlankOption = false,
  showSearch: showSearchProp,
  onBack,
  className,
}: MultiSelectFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-enable search if more than 10 options, or use explicit prop
  const showSearch = showSearchProp !== undefined ? showSearchProp : options.length > 10;

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((opt) => opt.value));
    }
  };

  const allSelected = selectedValues.length === options.length && options.length > 0;

  return (
    <div className={cx("flex flex-col gap-4 flex-1 min-h-0", className)}>
      {/* Header with back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors flex-shrink-0"
        >
          <ChevronLeft className="size-4" />
          <span className="font-semibold">{title}</span>
        </button>
      )}

      {!onBack && <h4 className="text-sm font-semibold text-primary flex-shrink-0">{title}</h4>}

      {showSearch && (
        <div className="relative flex-shrink-0">
          <SearchLg className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-tertiary" />
          <Input
            placeholder={`Search in ${title.toLowerCase()}`}
            size="sm"
            value={searchQuery}
            onChange={setSearchQuery}
            className="pl-9"
          />
        </div>
      )}

      <div className="flex flex-col gap-2 flex-1 min-h-0">
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

        {showBlankOption && (
          <button
            onClick={() => handleToggle("__blank__")}
            className="flex items-center gap-2 px-2 py-1.5 text-left text-sm text-secondary hover:bg-primary_hover rounded-md transition-colors"
          >
            <Checkbox
              size="sm"
              isSelected={selectedValues.includes("__blank__")}
              onChange={() => handleToggle("__blank__")}
            />
            Blank(s)
          </button>
        )}

        <div className="flex flex-col gap-1 flex-1">
          {filteredOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleToggle(option.value)}
              className="flex items-center justify-between gap-2 px-2 py-1.5 text-left text-sm text-secondary hover:bg-primary_hover rounded-md transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Checkbox
                  size="sm"
                  isSelected={selectedValues.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                />
                <span className="truncate">{option.label}</span>
              </div>
              {option.count !== undefined && (
                <span className="text-xs text-tertiary">{option.count}</span>
              )}
            </button>
          ))}

          {filteredOptions.length === 0 && (
            <div className="px-2 py-4 text-center text-sm text-tertiary">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
