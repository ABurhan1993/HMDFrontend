import { useState } from "react";
import Button from "@/components/ui/button/Button";
import axios from "@/components/utils/axios";
import { toast } from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
}

export default function ResetPasswordModal({ isOpen, onClose, userId, onSuccess }: Props) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!password.trim()) {
      toast.error("Password is required.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/user/reset-password", {
        userId: userId,
        newPassword: password,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
          Reset Password
        </h2>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter new password"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button onClick={onClose} size="sm" variant="outline">Cancel</Button>
          <Button onClick={handleSubmit} size="sm" disabled={loading}>
            {loading ? "Saving..." : "Save"
            }
          </Button>
        </div>
      </div>
    </div>
  );
}
