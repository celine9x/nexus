import { useState, useMemo, useEffect } from "react";
import SidebarDeal from "@/components/application/app-navigation/sidebar-navigation/sidebar-deal";
import { HubHeader } from "@/components/application/header/hub-header";
import { DotsVertical, Edit01, Trash01, ChevronDown } from "@untitledui/icons";
import type { SortDescriptor } from "react-aria-components";
import { DialogTrigger, Heading } from "react-aria-components";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { Table, TableCard } from "@/components/application/table/table";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { obligationsApi, agreementsApi, type Obligation, type Agreement, type ObligationStatus, type ObligationType } from "@/services/api";
import { useAlert } from "@/contexts/AlertContext";
import { StatusBadgeDropdown, type StatusOption } from "@/components/application/status-badge-dropdown/status-badge-dropdown";
import { MultiSelectFilter, type FilterOption } from "@/components/application/filters/multi-select-filter";
import { ActiveFiltersBar, type ActiveFilter } from "@/components/application/filters/active-filters-bar";
import { FilterCategoryList, type FilterCategory } from "@/components/application/filters/filter-category-list";

const obligationStatusOptions: StatusOption<ObligationStatus>[] = [
  { value: "pending", label: "Pending", color: "warning" },
  { value: "complete", label: "Complete", color: "success" },
  { value: "terminated", label: "Terminated", color: "error" },
];

const obligationTypeOptions: { value: ObligationType; label: string }[] = [
  { value: "deliverable", label: "Deliverable" },
  { value: "payment", label: "Payment" },
  { value: "milestone", label: "Milestone" },
  { value: "compliance", label: "Compliance" },
  { value: "other", label: "Other" },
];

const ObligationPage = () => {
  const { showAlert } = useAlert();
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formStatus, setFormStatus] = useState<ObligationStatus>("pending");
  const [formForecastedDate, setFormForecastedDate] = useState("");
  const [formType, setFormType] = useState<ObligationType>("deliverable");
  const [selectedAgreementId, setSelectedAgreementId] = useState<number | null>(null);

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilterScreen, setActiveFilterScreen] = useState<string | null>(null); // null = main screen, or filter key
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string[]>([]);
  const [filterAgreement, setFilterAgreement] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [obligationsData, agreementsData] = await Promise.all([
          obligationsApi.getAll(),
          agreementsApi.getAll(),
        ]);
        setObligations(obligationsData);
        setAgreements(agreementsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
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

    // Status category
    if (filterStatus.length > 0) {
      categories.push({
        key: 'status',
        label: 'Status',
        badge: filterStatus.length.toString(),
      });
    } else {
      categories.push({
        key: 'status',
        label: 'Status',
      });
    }

    // Type category
    if (filterType.length > 0) {
      categories.push({
        key: 'type',
        label: 'Type',
        badge: filterType.length.toString(),
      });
    } else {
      categories.push({
        key: 'type',
        label: 'Type',
      });
    }

    // Agreement category
    if (filterAgreement.length > 0) {
      categories.push({
        key: 'agreement',
        label: 'Agreement',
        badge: filterAgreement.length.toString(),
      });
    } else {
      categories.push({
        key: 'agreement',
        label: 'Agreement',
      });
    }

    return categories;
  }, [filterStatus, filterType, filterAgreement]);

  // Filter options
  const statusFilterOptions: FilterOption[] = useMemo(() =>
    obligationStatusOptions.map(opt => ({
      value: opt.value,
      label: opt.label,
      count: obligations.filter(o => o.status === opt.value).length
    })), [obligations]
  );

  const typeFilterOptions: FilterOption[] = useMemo(() =>
    obligationTypeOptions.map(opt => ({
      value: opt.value,
      label: opt.label,
      count: obligations.filter(o => o.type === opt.value).length
    })), [obligations]
  );

  const agreementFilterOptions: FilterOption[] = useMemo(() =>
    agreements.map(agr => ({
      value: agr.id.toString(),
      label: agr.title,
      count: obligations.filter(o => o.agreement_id === agr.id).length
    })), [agreements, obligations]
  );

  // Active filters for display
  const activeFilters: ActiveFilter[] = useMemo(() => {
    const filters: ActiveFilter[] = [];

    if (filterStatus.length > 0) {
      filters.push({
        key: 'status',
        label: 'Status',
        value: filterStatus.map(s => obligationStatusOptions.find(opt => opt.value === s)?.label || s),
        options: statusFilterOptions,
        selectedValues: filterStatus,
      });
    }

    if (filterType.length > 0) {
      filters.push({
        key: 'type',
        label: 'Type',
        value: filterType.map(t => obligationTypeOptions.find(opt => opt.value === t)?.label || t),
        options: typeFilterOptions,
        selectedValues: filterType,
      });
    }

    if (filterAgreement.length > 0) {
      filters.push({
        key: 'agreement',
        label: 'Agreement',
        value: filterAgreement.map(a => agreements.find(agr => agr.id.toString() === a)?.title || a),
        options: agreementFilterOptions,
        selectedValues: filterAgreement,
      });
    }

    return filters;
  }, [filterStatus, filterType, filterAgreement, agreements, statusFilterOptions, typeFilterOptions, agreementFilterOptions]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let items = [...obligations];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.agreement?.title.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.id.toString().includes(query)
      );
    }

    // Apply filters
    if (filterStatus.length > 0) {
      items = items.filter(item => filterStatus.includes(item.status));
    }

    if (filterType.length > 0) {
      items = items.filter(item => filterType.includes(item.type));
    }

    if (filterAgreement.length > 0) {
      items = items.filter(item => filterAgreement.includes(item.agreement_id.toString()));
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
          case "status":
            aValue = a.status;
            bValue = b.status;
            break;
          case "forecasted_date":
            aValue = a.forecasted_date;
            bValue = b.forecasted_date;
            break;
          case "agreement":
            aValue = a.agreement?.title || "";
            bValue = b.agreement?.title || "";
            break;
          case "type":
            aValue = a.type;
            bValue = b.type;
            break;
          default:
            return 0;
        }

        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return direction === "ascending" ? comparison : -comparison;
      });
    }

    return items;
  }, [obligations, filterStatus, filterType, filterAgreement, sortDescriptor, searchQuery]);

  const handleEdit = (id: number) => {
    console.log("Edit obligation:", id);
  };

  const handleDelete = async (id: number) => {
    try {
      await obligationsApi.delete(id);
      setObligations(obligations.filter((obligation) => obligation.id !== id));
      showAlert({
        title: "Success",
        description: "Obligation deleted successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Failed to delete obligation:", error);
      showAlert({
        title: "Error",
        description: "Failed to delete obligation",
        color: "error",
      });
    }
  };

  const handleStatusChange = async (id: number, newStatus: ObligationStatus) => {
    try {
      await obligationsApi.update(id, { status: newStatus });
      setObligations(
        obligations.map((obligation) =>
          obligation.id === id ? { ...obligation, status: newStatus } : obligation
        )
      );
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
    setFormStatus("pending");
    setFormForecastedDate("");
    setFormType("deliverable");
    setSelectedAgreementId(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!formTitle || !formForecastedDate || !selectedAgreementId) {
      showAlert({
        title: "Validation Error",
        description: "Please fill in all required fields",
        color: "warning",
      });
      return;
    }

    try {
      const newObligation = await obligationsApi.create({
        title: formTitle,
        status: formStatus,
        forecasted_date: formForecastedDate,
        agreement_id: selectedAgreementId,
        type: formType,
      });

      setObligations([...obligations, newObligation]);
      setFormTitle("");
      setFormStatus("pending");
      setFormForecastedDate("");
      setFormType("deliverable");
      setSelectedAgreementId(null);
      setIsModalOpen(false);
      showAlert({
        title: "Success",
        description: "Obligation created successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Failed to create obligation:", error);
      showAlert({
        title: "Error",
        description: "Failed to create obligation",
        color: "error",
      });
    }
  };

  // Filter handlers
  const handleRemoveFilter = (key: string) => {
    switch (key) {
      case 'status':
        setFilterStatus([]);
        break;
      case 'type':
        setFilterType([]);
        break;
      case 'agreement':
        setFilterAgreement([]);
        break;
    }
  };

  const handleEditFilter = (key: string, values: string[]) => {
    switch (key) {
      case 'status':
        setFilterStatus(values);
        break;
      case 'type':
        setFilterType(values);
        break;
      case 'agreement':
        setFilterAgreement(values);
        break;
    }
  };

  const handleClearAllFilters = () => {
    setFilterStatus([]);
    setFilterType([]);
    setFilterAgreement([]);
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
                    Create Obligation
                  </Heading>

                  {/* Form fields */}
                  <div className="flex flex-col gap-4">
                    <Input
                      label="Obligation Title"
                      placeholder="Enter obligation title"
                      size="md"
                      className="w-full"
                      value={formTitle}
                      onChange={setFormTitle}
                    />

                    <Dropdown.Root>
                      <Button iconTrailing={ChevronDown} color="secondary" size="md" className="w-full justify-between">
                        {selectedAgreementId
                          ? agreements.find(a => a.id === selectedAgreementId)?.title
                          : "Select Agreement"}
                      </Button>
                      <Dropdown.Popover>
                        <Dropdown.Menu>
                          {agreements.map((agreement) => (
                            <Dropdown.Item
                              key={agreement.id}
                              label={agreement.title}
                              onAction={() => setSelectedAgreementId(agreement.id)}
                            />
                          ))}
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown.Root>

                    <Dropdown.Root>
                      <Button iconTrailing={ChevronDown} color="secondary" size="md" className="w-full justify-between">
                        {obligationTypeOptions.find(t => t.value === formType)?.label || "Select Type"}
                      </Button>
                      <Dropdown.Popover>
                        <Dropdown.Menu>
                          {obligationTypeOptions.map((type) => (
                            <Dropdown.Item
                              key={type.value}
                              label={type.label}
                              onAction={() => setFormType(type.value)}
                            />
                          ))}
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown.Root>

                    <Dropdown.Root>
                      <Button iconTrailing={ChevronDown} color="secondary" size="md" className="w-full justify-between">
                        {obligationStatusOptions.find(s => s.value === formStatus)?.label || "Select Status"}
                      </Button>
                      <Dropdown.Popover>
                        <Dropdown.Menu>
                          {obligationStatusOptions.map((status) => (
                            <Dropdown.Item
                              key={status.value}
                              label={status.label}
                              onAction={() => setFormStatus(status.value)}
                            />
                          ))}
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown.Root>

                    <Input
                      label="Forecasted Date"
                      placeholder="YYYY-MM-DD"
                      size="md"
                      className="w-full"
                      value={formForecastedDate}
                      onChange={setFormForecastedDate}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button color="secondary" size="md" onClick={handleModalClose}>
                      Cancel
                    </Button>
                    <Button size="md" onClick={handleSubmit}>
                      Create Obligation
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
          title="Obligations"
          primaryButtonLabel="Create"
          badgeCount={obligations.length}
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
            aria-label="Obligations"
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <Table.Header>
              <Table.Head id="title" label="Title" allowsSorting />
              <Table.Head id="status" label="Status" allowsSorting />
              <Table.Head id="forecasted_date" label="Forecasted Date" allowsSorting />
              <Table.Head id="agreement" label="Agreement Name" allowsSorting />
              <Table.Head id="type" label="Type" allowsSorting />
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
                        <p className="text-xs text-tertiary">ID: {item.id}</p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadgeDropdown
                      value={item.status}
                      options={obligationStatusOptions}
                      onChange={(newStatus) => handleStatusChange(item.id, newStatus)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <p className="text-sm text-secondary">
                      {new Date(item.forecasted_date).toLocaleDateString()}
                    </p>
                  </Table.Cell>
                  <Table.Cell>
                    {item.agreement ? (
                      <div>
                        <p className="text-sm text-secondary">
                          {item.agreement.title}
                        </p>
                        <p className="text-xs text-tertiary">
                          ID: {item.agreement.id}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-tertiary">No agreement</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <p className="text-sm text-secondary capitalize">
                      {item.type}
                    </p>
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

                  {activeFilterScreen === 'type' && (
                    <MultiSelectFilter
                      title="Type"
                      options={typeFilterOptions}
                      selectedValues={filterType}
                      onChange={setFilterType}
                      onBack={handleBackToMain}
                    />
                  )}

                  {activeFilterScreen === 'agreement' && (
                    <MultiSelectFilter
                      title="Agreement"
                      options={agreementFilterOptions}
                      selectedValues={filterAgreement}
                      onChange={setFilterAgreement}
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

export default ObligationPage;
