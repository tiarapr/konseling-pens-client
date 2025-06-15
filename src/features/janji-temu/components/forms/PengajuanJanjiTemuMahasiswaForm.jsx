import { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import api from "@/api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function PengajuanJanjiTemuMahasiswaForm() {
    const [nrp, setNrp] = useState("");
    const [konselorOptions, setKonselorOptions] = useState([]);
    const [selectedDay, setSelectedDay] = useState("");
    const [altSelectedDay, setAltSelectedDay] = useState("");

    const [formData, setFormData] = useState({
        tipe_konsultasi: "",
        preferensi_konselor_id: "",
        jadwal_utama_tanggal: "",
        jadwal_utama_jam_mulai: "",
        jadwal_utama_jam_selesai: "",
        jadwal_alternatif_tanggal: "",
        jadwal_alternatif_jam_mulai: "",
        jadwal_alternatif_jam_selesai: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mhsRes, konselorRes] = await Promise.all([
                    api.get("/mahasiswa/me"),
                    api.get("/konselor"),
                ]);
                setNrp(mhsRes.data.data.mahasiswa.nrp || "");
                setKonselorOptions(
                    konselorRes.data.data.konselors.map(k => ({
                        label: k.nama_lengkap,
                        value: k.id,
                    }))
                );
            } catch (err) {
                setError("Gagal mengambil data mahasiswa atau konselor");
                console.error(err);
            }
        };

        fetchData();
    }, []);

    const calculateEndTime = (startTime, type) => {
        if (!startTime) return "";

        const [hours, minutes] = startTime.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);

        if (type === "online") {
            date.setMinutes(date.getMinutes() + 30); // 30 minutes for online
        } else if (type === "offline") {
            date.setMinutes(date.getMinutes() + 60); // 60 minutes for offline
        }

        // Format back to HH:MM
        const endHours = String(date.getHours()).padStart(2, '0');
        const endMinutes = String(date.getMinutes()).padStart(2, '0');
        return `${endHours}:${endMinutes}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // When consultation type changes
            if (name === "tipe_konsultasi") {
                // Clear all time fields
                newData.jadwal_utama_jam_mulai = "";
                newData.jadwal_utama_jam_selesai = "";
                newData.jadwal_alternatif_jam_mulai = "";
                newData.jadwal_alternatif_jam_selesai = "";
            }

            // When main start time changes
            if (name === "jadwal_utama_jam_mulai" && value && newData.tipe_konsultasi) {
                newData.jadwal_utama_jam_selesai = calculateEndTime(value, newData.tipe_konsultasi);
            }

            // When alternative start time changes
            if (name === "jadwal_alternatif_jam_mulai" && value && newData.tipe_konsultasi) {
                newData.jadwal_alternatif_jam_selesai = calculateEndTime(value, newData.tipe_konsultasi);
            }

            return newData;
        });

        // Update selected day when date changes
        if (name === "jadwal_utama_tanggal" && value) {
            const date = new Date(value);
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            setSelectedDay(days[date.getDay()]);
        }

        if (name === "jadwal_alternatif_tanggal" && value) {
            const date = new Date(value);
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            setAltSelectedDay(days[date.getDay()]);
        }
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateSchedule = (type, day, startTime, endTime) => {
        if (!type || !day || !startTime || !endTime) return null;

        if (type === "offline") {
            // Offline schedule validation
            if (!["Selasa", "Jumat"].includes(day)) {
                return "Konseling offline hanya tersedia pada hari Selasa dan Jumat";
            }

            const startHour = parseInt(startTime.split(':')[0]);
            const startMinute = parseInt(startTime.split(':')[1]);
            const endHour = parseInt(endTime.split(':')[0]);
            const endMinute = parseInt(endTime.split(':')[1]);

            // Check if time is between 13:00-15:00
            if (startHour < 13 || (startHour === 13 && startMinute < 0) ||
                endHour > 15 || (endHour === 15 && endMinute > 0)) {
                return "Konseling offline hanya tersedia pukul 13.00 - 15.00";
            }
        } else if (type === "online") {
            // Online schedule validation
            if (!["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].includes(day)) {
                return "Konseling online hanya tersedia pada hari Senin-Jumat";
            }

            const startHour = parseInt(startTime.split(':')[0]);
            const startMinute = parseInt(startTime.split(':')[1]);
            const endHour = parseInt(endTime.split(':')[0]);
            const endMinute = parseInt(endTime.split(':')[1]);

            // Check if time is between 9:00-16:00
            if (startHour < 9 || (startHour === 9 && startMinute < 0) ||
                endHour > 16 || (endHour === 16 && endMinute > 0)) {
                return "Konseling online hanya tersedia pukul 9.00 - 16.00";
            }
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (!nrp) {
            toast.error("NRP mahasiswa belum tersedia.");
            return;
        }

        // Validate main schedule
        if (formData.tipe_konsultasi && formData.jadwal_utama_tanggal &&
            formData.jadwal_utama_jam_mulai && formData.jadwal_utama_jam_selesai) {
            const mainError = validateSchedule(
                formData.tipe_konsultasi,
                selectedDay,
                formData.jadwal_utama_jam_mulai,
                formData.jadwal_utama_jam_selesai
            );

            if (mainError) {
                toast.error(`Jadwal Utama: ${mainError}`);
                return;
            }
        }

        // Validate alternative schedule if provided
        if (formData.jadwal_alternatif_tanggal &&
            formData.jadwal_alternatif_jam_mulai &&
            formData.jadwal_alternatif_jam_selesai) {
            const altError = validateSchedule(
                formData.tipe_konsultasi,
                altSelectedDay,
                formData.jadwal_alternatif_jam_mulai,
                formData.jadwal_alternatif_jam_selesai
            );

            if (altError) {
                toast.error(`Jadwal Alternatif: ${altError}`);
                return;
            }
        }

        setLoading(true);
        try {
            const payload = { nrp, ...formData };
            await api.post("/janji-temu", payload);

            toast.success("Janji temu berhasil diajukan!");
            navigate("/dashboard/janji-temu");
        } catch (err) {
            setError(err.response?.data?.message || "Gagal mengajukan janji temu");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dark:bg-gray-900">
            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
            {successMsg && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{successMsg}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 gap-4">
                <div>
                    <Label>NRP Mahasiswa</Label>
                    <Input type="text" value={nrp} readOnly />
                </div>

                <div>
                    <Label>Tipe Konsultasi</Label>
                    <Select
                        name="tipe_konsultasi"
                        value={formData.tipe_konsultasi}
                        options={[
                            { label: "Online", value: "online" },
                            { label: "Offline", value: "offline" },
                        ]}
                        placeholder="Pilih tipe konsultasi"
                        onChange={(val) => handleSelectChange("tipe_konsultasi", val)}
                        className="w-full"
                        required
                    />
                </div>

                <div>
                    <Label>Preferensi Konselor</Label>
                    <Select
                        name="preferensi_konselor_id"
                        value={formData.preferensi_konselor_id}
                        options={[{ label: "Tidak ada preferensi", value: "" }, ...konselorOptions]}
                        placeholder="Pilih konselor"
                        onChange={(val) => handleSelectChange("preferensi_konselor_id", val)}
                        className="w-full"
                    />
                </div>

                <fieldset className="border rounded p-4">
                    <legend className="font-semibold mb-2">Jadwal Utama</legend>
                    {selectedDay && (
                        <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                            Hari: {selectedDay}
                        </div>
                    )}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <Label>Tanggal</Label>
                            <Input
                                type="date"
                                name="jadwal_utama_tanggal"
                                value={formData.jadwal_utama_tanggal}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div>
                            <Label>Jam Mulai</Label>
                            <Input
                                type="time"
                                name="jadwal_utama_jam_mulai"
                                value={formData.jadwal_utama_jam_mulai}
                                onChange={handleChange}
                                required
                                step="1800"
                            />
                        </div>
                        <div>
                            <Label>Jam Selesai</Label>
                            <Input
                                type="time"
                                name="jadwal_utama_jam_selesai"
                                value={formData.jadwal_utama_jam_selesai}
                                onChange={handleChange}
                                required
                                readOnly
                                className="bg-gray-100 dark:bg-gray-700"
                            />
                        </div>
                    </div>
                    {formData.tipe_konsultasi === "offline" && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Jadwal offline tersedia Selasa & Jumat, 13.00-15.00. (Durasi 60 menit)
                        </p>
                    )}
                    {formData.tipe_konsultasi === "online" && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Jadwal online tersedia Senin-Jumat, 9.00-16.00. (Durasi 30 menit)
                        </p>
                    )}
                </fieldset>

                <fieldset className="border rounded p-4">
                    <legend className="font-semibold mb-2">Jadwal Alternatif</legend>
                    {altSelectedDay && (
                        <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                            Hari: {altSelectedDay}
                        </div>
                    )}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <Label>Tanggal</Label>
                            <Input
                                type="date"
                                name="jadwal_alternatif_tanggal"
                                value={formData.jadwal_alternatif_tanggal}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                        <div>
                            <Label>Jam Mulai</Label>
                            <Input
                                type="time"
                                name="jadwal_alternatif_jam_mulai"
                                value={formData.jadwal_alternatif_jam_mulai}
                                onChange={handleChange}
                                step="1800"
                                required
                            />
                        </div>
                        <div>
                            <Label>Jam Selesai</Label>
                            <Input
                                type="time"
                                name="jadwal_alternatif_jam_selesai"
                                value={formData.jadwal_alternatif_jam_selesai}
                                onChange={handleChange}
                                readOnly
                                required
                                className="bg-gray-100 dark:bg-gray-700"
                            />
                        </div>
                    </div>
                </fieldset>

                <div className="flex justify-end">
                    <Button type="submit" size="md" disabled={loading}>
                        {loading ? "Mengirim..." : "Ajukan Janji Temu"}
                    </Button>
                </div>
            </form>
        </div>
    );
}