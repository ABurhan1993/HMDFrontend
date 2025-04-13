import { useState } from "react";
import AddCustomerForm from "../../components/customers/AddCustomerForm";
import EditCustomerForm from "../../components/customers/EditCustomerForm"; // ✅
import Button from "../../components/ui/button/Button";
import CustomerTable from "@/components/customers/CustomerTable";
import type { CustomerData } from "@/types/customer";

const CustomerList = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerData | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

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
    <div className="p-4">
      <CustomerTable
        onAddClick={() => {
          setShowAddModal(true);
          setEditingCustomer(null);
        }}
        onEditClick={handleEditClick}
        refreshFlag={refreshFlag}
      />

      {/* فورم الإضافة */}
      <AddCustomerForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleSuccess}
      />

      {/* فورم التعديل */}
      <EditCustomerForm
        isOpen={showEditModal}
        editingCustomer={editingCustomer}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default CustomerList;
