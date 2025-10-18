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
import { agreementsApi, opportunitiesApi, alliancesApi, type Agreement, type Opportunity, type Alliance, type AgreementStatus } from "@/services/api";
import { useAlert } from "@/contexts/AlertContext";
import { StatusBadgeDropdown, type StatusOption } from "@/components/application/status-badge-dropdown/status-badge-dropdown";

const agreementStatusOptions: StatusOption<AgreementStatus>[] = [
  { value: "draft", label: "Draft", color: "gray" },
  { value: "expired", label: "Expired", color: "warning" },
  { value: "terminated", label: "Terminated", color: "error" },
  { value: "canceled", label: "Canceled", color: "error" },
  { value: "no", label: "No", color: "gray" },
];

const AgreementPage = () => {
  const { showAlert } = useAlert();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [alliances, setAlliances] = useState<Alliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<number | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agreementsData, opportunitiesData, alliancesData] = await Promise.all([
          agreementsApi.getAll(),
          opportunitiesApi.getAll(),
          alliancesApi.getAll(),
        ]);
        setAgreements(agreementsData);
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

  // Enrich agreements with related opportunity and alliance data
  const enrichedAgreements = useMemo(() => {
    return agreements.map((agreement) => {
      const opportunity = opportunities.find(o => o.id === agreement.opportunity_id);
      const alliance = alliances.find(a => a.id === agreement.alliance_id);
      return {
        ...agreement,
        opportunity,
        alliance,
      };
    });
  }, [agreements, opportunities, alliances]);

  // Sort items based on sort descriptor
  const sortedItems = useMemo(() => {
    const items = [...enrichedAgreements];
    const { column, direction } = sortDescriptor;

    if (!column) return items;

    items.sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (column) {
        case "title":
          aValue = a.title;
          bValue = b.title;
          break;
        case "opportunity":
          aValue = a.opportunity?.title || "";
          bValue = b.opportunity?.title || "";
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

    return items;
  }, [enrichedAgreements, sortDescriptor]);

  const handleEdit = (id: number) => {
    console.log("Edit agreement:", id);
  };

  const handleDelete = async (id: number) => {
    try {
      await agreementsApi.delete(id);
      setAgreements(agreements.filter((agreement) => agreement.id !== id));
      showAlert({
        title: "Success",
        description: "Agreement deleted successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Failed to delete agreement:", error);
      showAlert({
        title: "Error",
        description: "Failed to delete agreement",
        color: "error",
      });
    }
  };

  const handleStatusChange = async (id: number, newStatus: AgreementStatus) => {
    try {
      await agreementsApi.update(id, { status: newStatus });
      setAgreements(
        agreements.map((agreement) =>
          agreement.id === id ? { ...agreement, status: newStatus } : agreement
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
    setSelectedOpportunityId(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!formTitle || !selectedOpportunityId) {
      showAlert({
        title: "Validation Error",
        description: "Please fill in all fields",
        color: "warning",
      });
      return;
    }

    const selectedOpportunity = opportunities.find(o => o.id === selectedOpportunityId);
    if (!selectedOpportunity || !selectedOpportunity.alliance_id) {
      showAlert({
        title: "Validation Error",
        description: "Selected opportunity must have an alliance",
        color: "warning",
      });
      return;
    }

    try {
      const newAgreement = await agreementsApi.create({
        title: formTitle,
        opportunity_id: selectedOpportunityId,
        alliance_id: selectedOpportunity.alliance_id,
      });

      setAgreements([...agreements, newAgreement]);
      setFormTitle("");
      setSelectedOpportunityId(null);
      setIsModalOpen(false);
      showAlert({
        title: "Success",
        description: "Agreement created successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Failed to create agreement:", error);
      showAlert({
        title: "Error",
        description: "Failed to create agreement",
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
                    Create Agreement
                  </Heading>

                  {/* Form fields */}
                  <div className="flex flex-col gap-4">
                    <Input
                      label="Agreement Title"
                      placeholder="Enter agreement title"
                      size="md"
                      className="w-full"
                      value={formTitle}
                      onChange={setFormTitle}
                    />

                    <Dropdown.Root>
                      <Button iconTrailing={ChevronDown} color="secondary" size="md" className="w-full justify-between">
                        {selectedOpportunityId
                          ? opportunities.find(o => o.id === selectedOpportunityId)?.title
                          : "Select Opportunity"}
                      </Button>
                      <Dropdown.Popover>
                        <Dropdown.Menu>
                          {opportunities.map((opportunity) => (
                            <Dropdown.Item
                              key={opportunity.id}
                              label={opportunity.title}
                              onAction={() => setSelectedOpportunityId(opportunity.id)}
                            />
                          ))}
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown.Root>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button color="secondary" size="md" onClick={handleModalClose}>
                      Cancel
                    </Button>
                    <Button size="md" onClick={handleSubmit}>
                      Create Agreement
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
          title="Agreements"
          primaryButtonLabel="Create"
          badgeCount={agreements.length}
          onAction1={handleCreate}
          onAction2={() => console.log("Action 2")}
        />
        <TableCard.Root>
          <Table
            aria-label="Agreements"
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <Table.Header>
              <Table.Head id="title" label="Agreement Title" allowsSorting />
              <Table.Head id="opportunity" label="Opportunity" allowsSorting />
              <Table.Head id="alliance" label="Alliance" allowsSorting />
              <Table.Head id="status" label="Status" />
              <Table.Head id="actions" label="Actions" />
            </Table.Header>

            <Table.Body items={sortedItems}>
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
                    {item.opportunity ? (
                      <div>
                        <p className="text-sm text-secondary">
                          {item.opportunity.title}
                        </p>
                        <p className="text-xs text-tertiary">
                          ID: {item.opportunity.id}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-tertiary">No opportunity</span>
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
                      options={agreementStatusOptions}
                      onChange={(newStatus) => handleStatusChange(item.id, newStatus)}
                    />
                  </Table.Cell>
                  <Table.Cell className="px-4">
                    <div className="flex justify-end gap-1">
                      <ButtonUtility
                        size="xs"
                        color="secondary"
                        tooltip="Edit"
                        icon={Edit01}
                        onClick={() => handleEdit(item.id)}
                      />
                      <ButtonUtility
                        size="xs"
                        color="secondary"
                        tooltip="Delete"
                        icon={Trash01}
                        onClick={() => handleDelete(item.id)}
                      />
                      <ButtonUtility
                        size="xs"
                        color="secondary"
                        tooltip="More"
                        icon={DotsVertical}
                      />
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

export default AgreementPage;
