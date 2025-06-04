import { useState, useEffect } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Select from "../../form/Select";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function AssignNewPermissionToRoleModal({
    isOpen,
    closeModal,
    onSubmitSuccess,
    selectedRole,
}) {
    const [permissionOptions, setPermissionOptions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchPermissions();
        }
    }, [isOpen]);

    const fetchPermissions = async () => {
        try {
            const res = await api.get("/permissions");
            const permissions = res.data.data.permissions;
            setPermissionOptions(
                permissions.map(p => ({ value: p.name, label: p.name }))
            );
        } catch (err) {
            console.error(err);
            toast.error("Gagal memuat data permission");
        }
    };

    const handleSubmit = async () => {
        if (selectedPermissions.length === 0) {
            toast.error("Pilih minimal satu permission.");
            return;
        }

        setLoading(true);
        try {
            await api.post("/role-permissions", {
                role_id: selectedRole.id,
                permission_names: selectedPermissions.map(p => p.value),
            });

            toast.success("Permission berhasil ditambahkan.");
            onSubmitSuccess?.();
            closeModal();
            setSelectedPermissions([]);
        } catch (err) {
            console.error("Gagal menambahkan permission:", err);
            toast.error(err?.response?.data?.message || "Gagal menambahkan permission.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px]">
            <div className="p-6 bg-white dark:bg-gray-900 rounded-lg">
                <h4 className="text-xl font-semibold mb-4">
                    Assign New Permission to <span className="text-brand-600">{selectedRole?.name}</span>
                </h4>

                <div className="mb-4">
                    <Label>Permissions <span className="text-error-500">*</span></Label>
                    <Select
                        options={permissionOptions}
                        value={selectedPermissions}
                        onChange={setSelectedPermissions}
                        isMulti
                        placeholder="Pilih permission"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" size="sm" onClick={closeModal}>
                        Batal
                    </Button>
                    <Button size="sm" onClick={handleSubmit} loading={loading}>
                        Simpan
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
