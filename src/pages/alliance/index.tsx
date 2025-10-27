import { useState, useMemo, useEffect } from "react";
import SidebarDeal from "@/components/application/app-navigation/sidebar-navigation/sidebar-deal";
import { HubHeader } from "@/components/application/header/hub-header";
import { DotsVertical, Edit01, Trash01 } from "@untitledui/icons";
import type { SortDescriptor } from "react-aria-components";
import { DialogTrigger, Heading } from "react-aria-components";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { Table, TableCard } from "@/components/application/table/table";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Badge } from "@/components/base/badges/badges";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { alliancesApi, type AllianceWithRelations, type AllianceStatus } from "@/services/api";
import { useAlert } from "@/contexts/AlertContext";
import { StatusBadgeDropdown, type StatusOption } from "@/components/application/status-badge-dropdown/status-badge-dropdown";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { MultiSelectFilter, type FilterOption } from "@/components/application/filters/multi-select-filter";
import { ActiveFiltersBar, type ActiveFilter } from "@/components/application/filters/active-filters-bar";
import { FilterCategoryList, type FilterCategory } from "@/components/application/filters/filter-category-list";

const allianceStatusOptions: StatusOption<AllianceStatus>[] = [
  { value: "active", label: "Active", color: "success" },
  { value: "closed", label: "Closed", color: "gray" },
  { value: "launching", label: "Launching", color: "blue" },
  { value: "terminating", label: "Terminating", color: "error" },
];

const AlliancePage = () => {
  const { showAlert } = useAlert();
  const [alliancesWithRelations, setAlliancesWithRelations] = useState<AllianceWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilterScreen, setActiveFilterScreen] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await alliancesApi.getAllWithRelations();
        setAlliancesWithRelations(data);
      } catch (error) {
        console.error("Failed to fetch alliances:", error);
        showAlert({
          title: "Error",
          description: "Failed to load data from server",
          color: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter categories for main screen
  const filterCategories: FilterCategory[] = useMemo(() => {
    const categories: FilterCategory[] = [];

    if (filterStatus.length > 0) {
      categories.push({ key: 'status', label: 'Status', badge: filterStatus.length.toString() });
    } else {
      categories.push({ key: 'status', label: 'Status' });
    }

    return categories;
  }, [filterStatus]);

  // Filter options
  const statusFilterOptions: FilterOption[] = useMemo(() =>
    allianceStatusOptions.map(opt => ({
      value: opt.value,
      label: opt.label,
      count: alliancesWithRelations.filter(a => a.status === opt.value).length
    })), [alliancesWithRelations]
  );

  // Active filters for display
  const activeFilters: ActiveFilter[] = useMemo(() => {
    const filters: ActiveFilter[] = [];

    if (filterStatus.length > 0) {
      filters.push({
        key: 'status',
        label: 'Status',
        value: filterStatus.map(s => allianceStatusOptions.find(opt => opt.value === s)?.label || s),
        options: statusFilterOptions,
        selectedValues: filterStatus,
      });
    }

    return filters;
  }, [filterStatus, statusFilterOptions]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let items = [...alliancesWithRelations];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.id.toString().includes(query)
      );
    }

    // Apply filters
    if (filterStatus.length > 0) {
      items = items.filter(item => filterStatus.includes(item.status));
    }

    // Apply sorting
    const { column, direction } = sortDescriptor;

    if (column) {
      items.sort((a, b) => {
        let aValue: string | number = "";
        let bValue: string | number = "";

        switch (column) {
          case "title":
            aValue = a.title;
            bValue = b.title;
            break;
          case "opportunities":
            aValue = a.opportunities.length;
            bValue = b.opportunities.length;
            break;
          case "agreements":
            aValue = a.agreements.length;
            bValue = b.agreements.length;
            break;
          default:
            return 0;
        }

        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return direction === "ascending" ? comparison : -comparison;
      });
    }

    return items;
  }, [alliancesWithRelations, filterStatus, sortDescriptor, searchQuery]);

  const handleEdit = (id: number) => {
    console.log("Edit alliance:", id);
  };

  const handleDelete = async (id: number) => {
    try {
      await alliancesApi.delete(id);

      // Refresh the data after deletion
      const data = await alliancesApi.getAllWithRelations();
      setAlliancesWithRelations(data);
      showAlert({
        title: "Success",
        description: "Alliance deleted successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Failed to delete alliance:", error);
      showAlert({
        title: "Error",
        description: "Failed to delete alliance",
        color: "error",
      });
    }
  };

  const handleStatusChange = async (id: number, newStatus: AllianceStatus) => {
    try {
      await alliancesApi.update(id, { status: newStatus });

      // Refresh the data after status update
      const data = await alliancesApi.getAllWithRelations();
      setAlliancesWithRelations(data);
      showAlert({
        title: "Success",
        description: "Status updated successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      showAlert({
        title: "Error",
        description: "Failed to update status",
        color: "error",
      });
    }
  };

  const handleCreate = () => {
    setFormTitle("");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!formTitle) {
      showAlert({
        title: "Validation Error",
        description: "Please enter an alliance title",
        color: "warning",
      });
      return;
    }

    try {
      await alliancesApi.create({
        title: formTitle,
        status: "active",
      });

      // Refresh the data
      const data = await alliancesApi.getAllWithRelations();
      setAlliancesWithRelations(data);

      setFormTitle("");
      setIsModalOpen(false);
      showAlert({
        title: "Success",
        description: "Alliance created successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Failed to create alliance:", error);
      showAlert({
        title: "Error",
        description: "Failed to create alliance",
        color: "error",
      });
    }
  };

  // Filter handlers
  const handleRemoveFilter = (key: string) => {
    if (key === 'status') {
      setFilterStatus([]);
    }
  };

  const handleEditFilter = (key: string, values: string[]) => {
    if (key === 'status') {
      setFilterStatus(values);
    }
  };

  const handleClearAllFilters = () => {
    setFilterStatus([]);
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    setActiveFilterScreen(null);
  };

  const handleSelectFilterCategory = (key: string) => {
    setActiveFilterScreen(key);
  };

  const handleBackToMain = () => {
    setActiveFilterScreen(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex bg-secondary items-center justify-center">
        <p className="text-lg text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <DialogTrigger isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalOverlay isDismissable>
          <Modal>
            <Dialog>
              <div className="relative w-full max-w-120 overflow-hidden rounded-2xl bg-primary shadow-xl">
                <div className="flex flex-col gap-5 px-6 py-6">
                  <Heading slot="title" className="text-lg font-semibold text-primary">
                    Create Alliance
                  </Heading>

                  {/* Form fields */}
                  <div className="flex flex-col gap-4">
                    <Input
                      label="Alliance Title"
                      placeholder="Enter alliance title"
                      size="md"
                      className="w-full"
                      value={formTitle}
                      onChange={setFormTitle}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button color="secondary" size="md" onClick={handleModalClose}>
                      Cancel
                    </Button>
                    <Button size="md" onClick={handleSubmit}>
                      Create Alliance
                    </Button>
                  </div>
                </div>
              </div>
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>

      <div className="min-h-screen w-screen flex bg-secondary">
        <SidebarDeal />

      <div className="main-content flex-1 flex flex-col overflow-y-auto px-8 gap-4">
        <HubHeader
          title="Alliances"
          primaryButtonLabel="Create"
          badgeCount={alliancesWithRelations.length}
          onAction1={handleCreate}
          onAction2={() => setIsFilterOpen(true)}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Active Filters Bar */}
        <ActiveFiltersBar
          filters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onEditFilter={handleEditFilter}
          onClearAll={handleClearAllFilters}
        />

        <TableCard.Root>
          <Table
            aria-label="Alliances"
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <Table.Header>
              <Table.Head id="title" label="Alliance Title" allowsSorting />
              <Table.Head id="opportunities" label="Opportunities" allowsSorting />
              <Table.Head id="agreements" label="Agreements" allowsSorting />
              <Table.Head id="status" label="Status" />
              <Table.Head id="actions" label="Actions" />
            </Table.Header>

            <Table.Body items={filteredAndSortedItems}>
              {(item) => (
                <Table.Row id={item.id.toString()}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium text-primary">
                          {item.title}
                        </p>
                        <p className="text-xs text-tertiary">
                          ID: {item.id} • {item.opportunities.length}{" "}
                          {item.opportunities.length === 1
                            ? "Opportunity"
                            : "Opportunities"}{" "}
                          • {item.agreements.length}{" "}
                          {item.agreements.length === 1
                            ? "Agreement"
                            : "Agreements"}
                        </p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-1 max-w-md">
                      {item.opportunities.length > 0 ? (
                        <>
                          {item.opportunities.slice(0, 3).map((opportunity) => (
                            <Badge
                              key={opportunity.id}
                              color="blue"
                              size="sm"
                            >
                              {opportunity.title}
                            </Badge>
                          ))}
                          {item.opportunities.length > 3 && (
                            <Badge color="gray" size="sm">
                              +{item.opportunities.length - 3} more
                            </Badge>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-tertiary">
                          No opportunities
                        </span>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-wrap gap-1 max-w-md">
                      {item.agreements.length > 0 ? (
                        <>
                          {item.agreements.slice(0, 3).map((agreement) => (
                            <Badge
                              key={agreement.id}
                              color="purple"
                              size="sm"
                            >
                              {agreement.title}
                            </Badge>
                          ))}
                          {item.agreements.length > 3 && (
                            <Badge color="gray" size="sm">
                              +{item.agreements.length - 3} more
                            </Badge>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-tertiary">
                          No agreements
                        </span>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadgeDropdown
                      value={item.status}
                      options={allianceStatusOptions}
                      onChange={(newStatus) => handleStatusChange(item.id, newStatus)}
                    />
                  </Table.Cell>
                  <Table.Cell className="px-4">
                    <div className="flex justify-end gap-1">
                      <Dropdown.Root>
                        <ButtonUtility
                          size="xs"
                          color="secondary"
                          tooltip="More"
                          icon={DotsVertical}
                        />
                        <Dropdown.Popover>
                          <Dropdown.Menu>
                            <Dropdown.Item icon={Edit01} onAction={() => handleEdit(item.id)}>
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item icon={Trash01} onAction={() => handleDelete(item.id)}>
                              Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown.Root>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          <PaginationPageMinimalCenter
            page={1}
            total={1}
            className="px-4 py-3 md:px-6 md:pt-3 md:pb-4"
          />
        </TableCard.Root>
        </div>

        {/* Filter Slideout Panel */}
        <SlideoutMenu.Trigger isOpen={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SlideoutMenu>
            {({ close }) => (
              <>
                <SlideoutMenu.Header onClose={close}>
                  <Heading slot="title" className="text-xl font-semibold text-primary">
                    Filters
                  </Heading>
                </SlideoutMenu.Header>

                <SlideoutMenu.Content>
                  {!activeFilterScreen && (
                    <FilterCategoryList
                      categories={filterCategories}
                      onSelectCategory={handleSelectFilterCategory}
                    />
                  )}

                  {activeFilterScreen === 'status' && (
                    <MultiSelectFilter
                      title="Status"
                      options={statusFilterOptions}
                      selectedValues={filterStatus}
                      onChange={setFilterStatus}
                      onBack={handleBackToMain}
                    />
                  )}
                </SlideoutMenu.Content>

                <SlideoutMenu.Footer>
                  <div className="flex justify-between gap-3">
                    <Button color="secondary" size="md" onClick={handleClearAllFilters}>
                      Clear
                    </Button>
                    <Button size="md" onClick={handleApplyFilters}>
                      Apply filters
                    </Button>
                  </div>
                </SlideoutMenu.Footer>
              </>
            )}
          </SlideoutMenu>
        </SlideoutMenu.Trigger>
      </div>
    </>
  );
};

export default AlliancePage;
