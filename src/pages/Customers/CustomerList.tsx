import { useEffect, useState } from "react";
import AddCustomerForm from "@/components/customers/AddCustomerForm";
import EditCustomerForm from "@/components/customers/EditCustomerForm";
import CustomerTable from "@/components/customers/CustomerTable";
import CustomerStatsCards from "@/components/customers/CustomerStatsCards";
import axios from "@/components/utils/axios";
import type { CustomerData } from "@/types/customer";
import type { UserDto } from "@/types/UserDto";

const CustomerList = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerData | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [allCustomers, setAllCustomers] = useState<CustomerData[]>([]);

  useEffect(() => {
    axios.get("/customer/all").then((res) => setAllCustomers(res.data));
  }, [refreshFlag]);

  const [users, setUsers] = useState<UserDto[]>([]);
useEffect(() => {
  axios.get("/user/by-branch").then(res => setUsers(res.data));
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
      {/* ✅ Cards */}
      <CustomerStatsCards customers={allCustomers} onFilter={(status) => setFilterStatus(status)} />

      {/* ✅ Table */}
      <CustomerTable
        customers={allCustomers}
        onAddClick={() => {
          setShowAddModal(true);
          setEditingCustomer(null);
        }}
        onEditClick={handleEditClick}
        filterStatus={filterStatus}
      />

      {/* ✅ Add Form */}
      <AddCustomerForm
  isOpen={showAddModal}
  onClose={() => setShowAddModal(false)}
  onSuccess={handleSuccess}
  users={users}
/>

<EditCustomerForm
  isOpen={showEditModal}
  editingCustomer={editingCustomer}
  onClose={() => setShowEditModal(false)}
  onSuccess={handleSuccess}
  users={users}
/>

    </div>
  );
};

export default CustomerList;
