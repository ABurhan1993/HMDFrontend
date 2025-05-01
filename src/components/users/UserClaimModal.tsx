import { useEffect, useState } from "react";
import axios from "@/components/utils/axios";
import Button from "@/components/ui/button/Button";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    onSuccess?: () => void;
}

interface UserClaim {
    id: number;
    claimType: string;
    claimValue: string;
}

const UserClaimsModal = ({ isOpen, onClose, userId, onSuccess }: Props) => {
    const [claims, setClaims] = useState<UserClaim[]>([]);
    const [allPermissions, setAllPermissions] = useState<string[]>([]);
    const [selectedClaim, setSelectedClaim] = useState("");

    // جلب صلاحيات المستخدم
    useEffect(() => {
        if (isOpen && userId) {
            axios.get(`/userclaim/by-user/${userId}`).then((res) => setClaims(res.data));
        }
    }, [isOpen, userId]);

    // جلب كل الصلاحيات
    useEffect(() => {
        if (isOpen) {
          axios.get("/userclaim/all-permissions").then((res) => {
            const flattened = Object.values(res.data).flat() as string[];
      
            // 🧠 إزالة الصلاحيات اللي عند المستخدم
            const existing = new Set(claims.map((c) => c.claimValue));
            const filtered = flattened.filter((perm) => !existing.has(perm));
      
            setAllPermissions(filtered);
          });
        }
      }, [isOpen, claims]);
      


    const addClaim = async () => {
        if (!selectedClaim) return;
        await axios.post("/userclaim/add", {
            userId,
            claimType: "permission",
            claimValue: selectedClaim,
        });
        setSelectedClaim("");
        const res = await axios.get(`/userclaim/by-user/${userId}`);
        setClaims(res.data);
        onSuccess?.();
    };

    const deleteClaim = async (id: number) => {
        await axios.delete(`/userclaim/${id}`);
        setClaims((prev) => prev.filter((c) => c.id !== id));
        onSuccess?.();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">User Permissions</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500">✕</button>
                </div>

                <div className="mb-4">
                    <select
                        value={selectedClaim}
                        onChange={(e) => setSelectedClaim(e.target.value)}
                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">Select permission</option>
                        {allPermissions.map((perm) => (
                            <option key={perm} value={perm}>{perm}</option>
                        ))}
                    </select>
                    <Button onClick={addClaim} className="mt-2" size="sm">Add Permission</Button>
                </div>

                <ul className="space-y-2">
                    {claims.map((claim) => (
                        <li key={claim.id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded">
                            <span className="text-sm text-gray-900 dark:text-white">{claim.claimValue}</span>
                            <button
                                onClick={() => deleteClaim(claim.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserClaimsModal;
