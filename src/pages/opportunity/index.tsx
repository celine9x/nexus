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
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { opportunitiesApi, alliancesApi, type Opportunity, type Alliance, type OpportunityStatus } from "@/services/api";
import { useAlert } from "@/contexts/AlertContext";
import { StatusBadgeDropdown, type StatusOption } from "@/components/application/status-badge-dropdown/status-badge-dropdown";

const opportunityStatusOptions: StatusOption<OpportunityStatus>[] = [
  { value: "active", label: "Active", color: "success" },
  { value: "decline", label: "Decline", color: "error" },
  { value: "on-hold", label: "On Hold", color: "warning" },
];


const OpportunityPage = () => {
  const { showAlert } = useAlert();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [alliances, setAlliances] = useState<Alliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [selectedAllianceId, setSelectedAllianceId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [opportunitiesData, alliancesData] = await Promise.all([
          opportunitiesApi.getAll(),
          alliancesApi.getAll(),
        ]);
        setOpportunities(opportunitiesData);
        setAlliances(alliancesData);
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

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let items = [...opportunities];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.alliance?.title.toLowerCase().includes(query) ||
        item.id.toString().includes(query)
      );
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
          case "agreement":
            aValue = a.agreement?.title || "";
            bValue = b.agreement?.title || "";
            break;
          case "alliance":
            aValue = a.alliance?.title || "";
            bValue = b.alliance?.title || "";
            break;
          default:
            return 0;
        }

        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return direction === "ascending" ? comparison : -comparison;
      });
    }

    return items;
  }, [opportunities, sortDescriptor, searchQuery]);

  const handleEdit = (id: number) => {
    console.log("Edit opportunity:", id);
  };

  const handleDelete = async (id: number) => {
    try {
      await opportunitiesApi.delete(id);
      setOpportunities(opportunities.filter((opp) => opp.id !== id));
      showAlert({
        title: "Success",
        description: "Opportunity deleted successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Failed to delete opportunity:", error);
      showAlert({
        title: "Error",
        description: "Failed to delete opportunity",
        color: "error",
      });
    }
  };

  const handleStatusChange = async (id: number, newStatus: OpportunityStatus) => {
    try {
      await opportunitiesApi.update(id, { status: newStatus });
      setOpportunities(
        opportunities.map((opp) =>
          opp.id === id ? { ...opp, status: newStatus } : opp
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
    setSelectedAllianceId(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!formTitle) {
      showAlert({
        title: "Validation Error",
        description: "Please enter an opportunity title",
        color: "warning",
      });
      return;
    }

    try {
      const newOpportunity = await opportunitiesApi.create({
        title: formTitle,
        agreement_id: null,
        alliance_id: selectedAllianceId || null,
        status: "active",
      });

      setOpportunities([...opportunities, newOpportunity]);
      setFormTitle("");
      setSelectedAllianceId(null);
      setIsModalOpen(false);
      showAlert({
        title: "Success",
        description: "Opportunity created successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Failed to create opportunity:", error);
      showAlert({
        title: "Error",
        description: "Failed to create opportunity",
        color: "error",
      });
    }
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
                    Create Opportunity
                  </Heading>

                  {/* Form fields */}
                  <div className="flex flex-col gap-4">
                    <Input
                      label="Opportunity Title"
                      placeholder="Enter opportunity title"
                      size="md"
                      className="w-full"
                      value={formTitle}
                      onChange={setFormTitle}
                    />

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-secondary">
                        Alliance <span className="text-tertiary">(Optional)</span>
                      </label>
                      <Dropdown.Root>
                        <Button iconTrailing={ChevronDown} color="secondary" size="md" className="w-full justify-between">
                          {selectedAllianceId
                            ? alliances.find(a => a.id === selectedAllianceId)?.title
                            : "Select Alliance"}
                        </Button>
                      <Dropdown.Popover>
                        
                        <Dropdown.Menu>
                          {alliances.map((alliance) => (
                            
                            <Dropdown.Item
                              key={alliance.id}
                              label={alliance.title}
                              onAction={() => setSelectedAllianceId(alliance.id)}
                            />
                          ))}
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                      </Dropdown.Root>
                    </div>

                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button color="secondary" size="md" onClick={handleModalClose}>
                      Cancel
                    </Button>
                    <Button size="md" onClick={handleSubmit}>
                      Create Opportunity
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
            title="Opportunities"
            primaryButtonLabel="Create"
            badgeCount={opportunities.length}
            onAction1={handleCreate}
            onAction2={() => console.log("Action 2")}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <TableCard.Root>
            <Table
              aria-label="Opportunities"
              selectionMode="multiple"
              sortDescriptor={sortDescriptor}
              onSortChange={setSortDescriptor}
            >
              <Table.Header>
                <Table.Head id="title" label="Title" allowsSorting />
                <Table.Head id="agreement" label="Agreement" allowsSorting />
                <Table.Head id="alliance" label="Alliance" allowsSorting />
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
                          <p className="text-xs text-tertiary">ID: {item.id}</p>
                        </div>
                      </div>
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
                      {item.alliance ? (
                        <div>
                          <p className="text-sm text-secondary">
                            {item.alliance.title}
                          </p>
                          <p className="text-xs text-tertiary">
                            ID: {item.alliance.id}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-tertiary">No alliance</span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <StatusBadgeDropdown
                        value={item.status}
                        options={opportunityStatusOptions}
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
      </div>
    </>
  );
};

export default OpportunityPage;
