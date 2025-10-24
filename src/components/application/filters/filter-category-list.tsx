import { ChevronRight } from "@untitledui/icons";
import { cx } from "@/utils/cx";

export interface FilterCategory {
  key: string;
  label: string;
  badge?: string;
  count?: number;
}

export interface FilterCategoryListProps {
  categories: FilterCategory[];
  onSelectCategory: (key: string) => void;
  className?: string;
}

export const FilterCategoryList = ({ categories, onSelectCategory, className }: FilterCategoryListProps) => {
  return (
    <div className={cx("flex flex-col gap-1 flex-1", className)}>
      {categories.map((category) => (
        <button
          key={category.key}
          onClick={() => onSelectCategory(category.key)}
          className="flex items-center justify-between px-3 py-2.5 text-left text-sm text-secondary hover:bg-primary_hover rounded-md transition-colors group"
        >
          <span className="font-medium">{category.label}</span>
          <div className="flex items-center gap-2">
            {category.badge && (
              <span className="inline-flex items-center rounded-full bg-utility-brand-50 px-2 py-0.5 text-xs font-medium text-utility-brand-700 ring-1 ring-inset ring-utility-brand-200">
                {category.badge}
              </span>
            )}
            {category.count !== undefined && category.count > 0 && (
              <span className="text-xs text-tertiary">
                {category.count}
              </span>
            )}
            <ChevronRight className="size-4 text-tertiary group-hover:text-secondary transition-colors" />
          </div>
        </button>
      ))}
    </div>
  );
};
