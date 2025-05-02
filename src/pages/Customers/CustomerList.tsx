import { useEffect, useState } from "react";
import AddCustomerForm from "@/components/customers/AddCustomerForm";
import EditCustomerForm from "@/components/customers/EditCustomerForm";
import CustomerTable from "@/components/customers/CustomerTable";
import CustomerStatsCards from "@/components/customers/CustomerStatsCards";
import CreatedByStatsCards from "@/components/customers/CreatedByStatsCards";
import AssignedToStatsCards from "@/components/customers/AssignedToStatsCards";
import axios from "@/components/utils/axios";
import type { CustomerData } from "@/types/customer";
import type { UserDto } from "@/types/UserDto";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-hot-toast";

const CustomerList = () => {
  const user = useUser();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerData | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [allCustomers, setAllCustomers] = useState<CustomerData[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [filterCreatedBy, setFilterCreatedBy] = useState<string | null>(null);
  const [filterAssignedTo, setFilterAssignedTo] = useState<string | null>(null);
  const [filterCreatedDate, setFilterCreatedDate] = useState<"today" | "week" | "month" | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerData | null>(null);

  const fetchCustomers = () => {
    axios.get("/customer/all").then((res) => setAllCustomers(res.data));
  };

  useEffect(() => {
    fetchCustomers();
  }, [refreshFlag]);

  useEffect(() => {
    axios.get("/user/by-branch").then((res) => setUsers(res.data));
  }, []);

  const handleSuccess = () => {
    setRefreshFlag((prev) => !prev);
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingCustomer(null);
  };

  const handleEditClick = (customer: CustomerData) => {
    setEditingCustomer(customer);
    setShowEditModal(true);
  };

  const handleDeleteCustomer = (customer: CustomerData) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      await axios.delete(`/customer/delete?id=${customerToDelete.customerId}`);
      toast.success("Customer deleted successfully");
      fetchCustomers();
    } catch {
      toast.error("Failed to delete customer");
    } finally {
      setCustomerToDelete(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <CreatedByStatsCards
  onFilter={(userId) => {
    setFilterCreatedBy(userId || null); // ← دعم null لما يضغط All
  }}
/>


<CustomerStatsCards
  customers={allCustomers}
  selectedCreatedById={filterCreatedBy}
  onFilter={(status) => {
    setFilterStatus(status || null); // ← لو ضغط "All" يرجّع null
  }}
/>



<AssignedToStatsCards
  onFilter={(userId) => {
    setFilterAssignedTo(userId);
    setFilterCreatedBy(null); // ← لضمان عدم تداخل الفلاتر
    setFilterStatus(null);
  }}
/>

      <CustomerTable
        customers={allCustomers}
        onAddClick={() => {
          setShowAddModal(true);
          setEditingCustomer(null);
        }}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteCustomer}
        filterStatus={filterStatus}
        filterCreatedBy={filterCreatedBy}
        filterAssignedTo={filterAssignedTo}
        filterCreatedDate={filterCreatedDate}
        setFilterCreatedDate={setFilterCreatedDate}
        onRefresh={fetchCustomers}
      />

      {user?.permissions.includes("Permissions.Customers.Create") && (
        <AddCustomerForm
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleSuccess}
          users={users}
        />
      )}

      {user?.permissions.includes("Permissions.Customers.Edit") && (
        <EditCustomerForm
          isOpen={showEditModal}
          editingCustomer={editingCustomer}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleSuccess}
          users={users}
        />
      )}

      {showDeleteModal && customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg text-gray-700 dark:text-gray-200 mb-4 text-center">
              Are you sure you want to delete this customer?
            </h3>
            <div className="flex justify-center gap-4">
              <button className="text-white bg-red-600 hover:bg-red-800 px-5 py-2 rounded-lg text-sm" onClick={confirmDelete}>
                Yes, I'm sure
              </button>
              <button className="px-5 py-2 text-sm border rounded-lg bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-white" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
