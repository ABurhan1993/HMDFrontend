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
import { useUser } from "@/hooks/useUser"; // ✅ إضافة

const CustomerList = () => {
  const user = useUser(); // ✅ جلب معلومات المستخدم

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

  return (
    <div className="p-4 space-y-6">

      {/* ✅ Created By Cards (Top) */}
      <CreatedByStatsCards onFilter={(userId) => {
        setFilterCreatedBy(userId);
        setFilterAssignedTo(null);
        setFilterStatus(null);
      }} />

      {/* ✅ Contact Status Cards */}
      <CustomerStatsCards
        customers={allCustomers}
        onFilter={(status) => {
          setFilterStatus(status);
          setFilterCreatedBy(null);
          setFilterAssignedTo(null);
        }}
      />

      {/* ✅ Assigned To Cards */}
      <AssignedToStatsCards onFilter={(userId) => {
        setFilterAssignedTo(userId);
        setFilterCreatedBy(null);
        setFilterStatus(null);
      }} />

      {/* ✅ Customer Table */}
      <CustomerTable
        customers={allCustomers}
        onAddClick={() => {
          setShowAddModal(true);
          setEditingCustomer(null);
        }}
        onEditClick={handleEditClick}
        filterStatus={filterStatus}
        filterCreatedBy={filterCreatedBy}
        filterAssignedTo={filterAssignedTo}
        filterCreatedDate={filterCreatedDate}
        setFilterCreatedDate={setFilterCreatedDate}
        onRefresh={fetchCustomers}
      />

      {/* ✅ Add Modal */}
      {user?.permissions.includes("Permissions.Customers.Create") && (
        <AddCustomerForm
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleSuccess}
          users={users}
        />
      )}

      {/* ✅ Edit Modal */}
      {user?.permissions.includes("Permissions.Customers.Edit") && (
        <EditCustomerForm
          isOpen={showEditModal}
          editingCustomer={editingCustomer}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleSuccess}
          users={users}
        />
      )}
      
    </div>
  );
};

export default CustomerList;
