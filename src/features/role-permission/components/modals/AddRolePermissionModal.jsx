import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import MultiSelect from "@/components/form/MultiSelect";
import api from "@/api/api";
import { toast } from "react-toastify";

export default function AddRolePermissionModal({ isOpen, closeModal, onSubmitSuccess }) {
    const [roleOptions, setRoleOptions] = useState([]);
    const [permissionOptions, setPermissionOptions] = useState([]);

    const [selectedRole, setSelectedRole] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchRoles();
            fetchPermissions();
        }
    }, [isOpen]);

    const fetchRoles = async () => {
        try {
            const res = await api.get("/role");
            const roles = res.data.data.role;
            setRoleOptions(
                roles.map((role) => ({
                    value: role.id,
                    label: role.name,
                }))
            );
        } catch (err) {
            console.error(err);
            toast.error("Gagal memuat data role");
        }
    };

    const fetchPermissions = async () => {
        try {
            const res = await api.get("/permissions");
            const permissions = res.data.data.permissions;
            setPermissionOptions(
                permissions.map((p) => ({
                    value: p.id,
                    label: p.name,
                }))
            );
        } catch (err) {
            console.error(err);
            toast.error("Gagal memuat data permission");
        }
    };

    const handleSubmit = async () => {
        if (!selectedRole || selectedPermissions.length === 0) {
            toast.error("Semua field wajib diisi.");
            return;
        }

        setLoading(true);
        try {
            // Get permission names directly from selected permission IDs
            const permissionNames = permissionOptions
                .filter(permission => selectedPermissions.includes(permission.value))
                .map(permission => permission.label);

            await api.post("/role-permissions", {
                role_id: selectedRole,
                permission_names: permissionNames,
            });

            toast.success("Permission berhasil ditambahkan ke role.");
            onSubmitSuccess?.();
            closeModal();
            setSelectedRole("");
            setSelectedPermissions([]);
        } catch (err) {
            console.error("Gagal menyimpan role permission:", err);
            toast.error(err?.response?.data?.message || "Gagal menyimpan role permission.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px]">
            <div className="p-6 bg-white dark:bg-gray-900 rounded-lg">
                <h4 className="text-xl font-semibold mb-4">Assign Role Permission</h4>

                <div className="mb-4">
                    <Label>
                        Role <span className="text-error-500">*</span>
                    </Label>
                    <Select
                        options={roleOptions}
                        value={selectedRole}
                        onChange={(value) => setSelectedRole(value)}
                        placeholder="Pilih role"
                    />
                </div>

                <div className="mb-4">
                    <Label>
                        Permissions <span className="text-error-500">*</span>
                    </Label>
                    <MultiSelect
                        options={permissionOptions}
                        value={selectedPermissions}
                        onChange={setSelectedPermissions}
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
