import { Badge } from "@/components/base/badges/badges";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import {
  AlignJustify,
  ArrowLeft,
  ChevronDown,
  Plus,
  Rows02,
  SearchMd,
  Settings01,
  Sliders02,
  Upload01
} from "@untitledui/icons";
import React, { useState } from "react";
import { Input } from "@/components/base/input/input";

export type HubHeaderVariant = "dropdown" | "tabs";

interface HubHeaderProps {
  variant?: HubHeaderVariant;
  title?: string;
  badgeCount?: number;
  onAction1?: () => void;
  onAction2?: () => void;
  onAction3?: () => void;
  onBack?: () => void;
  primaryButtonLabel?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export const HubHeader: React.FC<HubHeaderProps> = ({
  variant = "dropdown",
  title = "Header",
  badgeCount = 5,
  onAction1,
  onAction2,
  onBack,
  onAction3,
  primaryButtonLabel = "Create",
  searchValue = "",
  onSearchChange
}) => {
  const [selectedOption, setSelectedOption] = useState("Option 1");
  const [selectedView, setSelectedView] = useState("View 1");

  return (
    <header className="w-full border-b border-secondary">
      {variant === "tabs" ? (
        <div className="flex flex-col gap-4 p-4">
          {/* Top section */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Button
                color="secondary"
                iconLeading={ArrowLeft}
                onClick={onBack}
              >
                Back
              </Button>

              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold text-primary">{title}</h1>
                <Badge size="md" type="modern">
                  {badgeCount}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                color="primary"
                iconLeading={Plus}
                size="md"
                onClick={onAction1}
              >
                {primaryButtonLabel}
              </Button>

              <Dropdown.Root>
                <Dropdown.DotsButton />
                <Dropdown.Popover>
                  <Dropdown.Menu>
                    <Dropdown.Item key="edit" label="Edit" />
                    <Dropdown.Item key="duplicate" label="Duplicate" />
                    <Dropdown.Separator />
                    <Dropdown.Item key="delete" label="Delete" />
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown.Root>
            </div>
          </div>

          {/* Bottom section with tabs */}
          <div className="flex items-center justify-between w-full">
            <ButtonGroup size="lg">
              <ButtonGroupItem
                isSelected={selectedView === "View 1"}
                onPress={() => setSelectedView("View 1")}
              >
                View 1
              </ButtonGroupItem>
              <ButtonGroupItem
                isSelected={selectedView === "View 2"}
                onPress={() => setSelectedView("View 2")}
              >
                View 2
              </ButtonGroupItem>
              <ButtonGroupItem
                isSelected={selectedView === "View 3"}
                onPress={() => setSelectedView("View 3")}
              >
                View 3
              </ButtonGroupItem>
              <ButtonGroupItem
                isSelected={selectedView === "View 4"}
                onPress={() => setSelectedView("View 4")}
              >
                View 4
              </ButtonGroupItem>
              <ButtonGroupItem iconTrailing={ChevronDown}>
                All views
              </ButtonGroupItem>
            </ButtonGroup>
          </div>
        </div>
      ) : (
        <div className="flex gap-8 items-center justify-between w-full p-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <h1 className="text-xl font-semibold text-primary">{title}</h1>
              <Badge size="md" type="modern">
                {badgeCount}
              </Badge>
            </div>

            <Dropdown.Root>
              <Button
                color="secondary"
                size="md"
                iconTrailing={ChevronDown}
              >
                {selectedOption}
              </Button>
              <Dropdown.Popover>
                <Dropdown.Menu
                  onAction={(key) => setSelectedOption(key as string)}
                  selectedKeys={[selectedOption]}
                >
                  <Dropdown.Item key="Option 1" label="Option 1" />
                  <Dropdown.Item key="Option 2" label="Option 2" />
                  <Dropdown.Item key="Option 3" label="Option 3" />
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown.Root>

            <ButtonGroup size="md">
              <ButtonGroupItem iconLeading={AlignJustify} />
              <ButtonGroupItem iconLeading={Rows02} />
            </ButtonGroup>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Input
                icon={SearchMd}
                placeholder="Search"
                size="sm"
                value={searchValue}
                onChange={onSearchChange}
              />

              <Button
                color="secondary"
                size="md"
                iconLeading={Sliders02}
                onClick={onAction2}
              >
                Filter
              </Button>

              <Button
                color="secondary"
                size="md"
                iconLeading={Settings01}
                onClick={onAction3}
              />

              <Button
                color="secondary"
                size="md"
                iconLeading={Upload01}
                onClick={onAction2}
              >
                Export
              </Button>
            </div>

            <Button
              color="primary"
              iconLeading={Plus}
              size="md"
              onClick={onAction1}
            >
          {primaryButtonLabel}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
