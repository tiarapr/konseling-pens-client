import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../../icons";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import DatePicker from "../../form/date-picker";
import FileInput from "../../form/input/FileInput";
import api from "../../../api/api";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditMahasiswaProfilForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const [studyProgram, setStudyProgram] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [programOptions, setProgramOptions] = useState([]);
    const [currentKtm, setCurrentKtm] = useState("");
    const [ktmFile, setKtmFile] = useState(null);
    const [initialData, setInitialData] = useState(null);
    const [formData, setFormData] = useState({
        nama_lengkap: "",
        nrp: "",
        program_studi_id: "",
        tanggal_lahir: "",
        jenis_kelamin: "",
        ktm_url: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch study programs
                const programsResponse = await api.get("/program-studi");
                const options = programsResponse.data.data.programStudi.map((item) => ({
                    value: item.id,
                    label: `${item.jenjang} ${item.nama_program_studi}`,
                }));
                setProgramOptions(options);

                // Fetch current student data
                const studentResponse = await api.get(`/mahasiswa/me`);
                const student = studentResponse.data.data.mahasiswa;

                const initialData = {
                    nama_lengkap: student.nama_lengkap,
                    nrp: student.nrp,
                    program_studi_id: student.program_studi?.id || "",
                    tanggal_lahir: student.tanggal_lahir,
                    jenis_kelamin: student.jenis_kelamin === "L" ? "male" : "female",
                    ktm_url: student.ktm_url || ""
                };

                setInitialData(initialData);
                setFormData(initialData);
                setBirthDate(student.tanggal_lahir);
                setGender(student.jenis_kelamin === "L" ? "male" : "female");
                setStudyProgram(student.program_studi?.id || ""); // Set the raw value here
                setCurrentKtm(student.ktm_url || "");
            } catch (error) {
                console.error("Failed to fetch data:", error.message);
                toast.error("Failed to load data. Please try again later.");
            }
        };

        fetchData();
    }, [id]);

    const hasChanges = () => {
        if (!initialData) return false;

        return (
            formData.nama_lengkap !== initialData.nama_lengkap ||
            formData.nrp !== initialData.nrp ||
            studyProgram !== initialData.program_studi_id ||
            birthDate !== initialData.tanggal_lahir ||
            gender !== initialData.jenis_kelamin ||
            ktmFile !== null
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!hasChanges()) {
            toast.info("No changes detected.");
            return;
        }

        // Validate required fields
        if (!studyProgram) {
            toast.error("Please select a study program");
            return;
        }

        setIsSubmitting(true);

        try {
            const form = e.target;
            const formData = new FormData();

            formData.append("program_studi_id", studyProgram);
            if (form.nama_lengkap.value !== initialData.nama_lengkap) {
                formData.append("nama_lengkap", form.nama_lengkap.value);
            }
            if (form.nrp.value !== initialData.nrp) {
                formData.append("nrp", form.nrp.value);
            }
            if (birthDate !== initialData.tanggal_lahir) {
                formData.append("tanggal_lahir", birthDate);
            }
            if (gender !== initialData.jenis_kelamin) {
                formData.append("jenis_kelamin", gender === "male" ? "L" : "P");
            }

            if (ktmFile) {
                if (ktmFile.size > 2 * 1024 * 1024) {
                    toast.error("File size should not exceed 2MB.");
                    setIsSubmitting(false);
                    return;
                }
                formData.append("ktm_url", ktmFile);
            }

            const response = await api.patch(`/mahasiswa/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            toast.success(response.data.message || "Update successful");
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            const message =
                error.response?.data?.message || "Something went wrong during update.";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setKtmFile(e.target.files[0]);
    };

    return (
        <div className="">
            <div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Label htmlFor="nama_lengkap">
                                Full Name<span className="text-error-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                id="nama_lengkap"
                                name="nama_lengkap"
                                value={formData.nama_lengkap}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                required
                                minLength={3}
                                maxLength={100}
                            />
                        </div>

                        {/* NRP */}
                        <div className="sm:col-span-1">
                            <Label htmlFor="nrp">
                                NRP<span className="text-error-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                id="nrp"
                                name="nrp"
                                value={formData.nrp}
                                onChange={handleInputChange}
                                placeholder="Enter your NRP (10 digits)"
                                required
                                pattern="[0-9]{10}"
                                title="NRP must be exactly 10 digits"
                            />
                        </div>

                        {/* Study Program */}
                        <div className="sm:col-span-2">
                            <Label htmlFor="studyProgram">
                                Study Program<span className="text-error-500">*</span>
                            </Label>
                            <Select
                                id="studyProgram"
                                options={programOptions}
                                defaultValue={studyProgram} // This should be the value (not the whole option object)
                                placeholder="Select your study program"
                                required
                                onChange={(value) => {
                                    setStudyProgram(value);
                                    setFormData(prev => ({ ...prev, program_studi_id: value }));
                                }}
                            />
                        </div>

                        {/* Birth Date */}
                        <div className="sm:col-span-2">
                            <DatePicker
                                id="date-picker"
                                label="Birth Date"
                                value={birthDate}
                                placeholder="Select your birth date"
                                onChange={(dateStr) => {
                                    setBirthDate(dateStr);
                                    setFormData(prev => ({ ...prev, tanggal_lahir: dateStr }));
                                }}
                                required
                                maxDate={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        {/* Gender */}
                        <div className="sm:col-span-2">
                            <Label>
                                Gender<span className="text-error-500">*</span>
                            </Label>
                            <div className="flex gap-4 mt-2">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="male"
                                        name="gender"
                                        value="male"
                                        checked={gender === "male"}
                                        onChange={() => {
                                            setGender("male");
                                            setFormData(prev => ({ ...prev, jenis_kelamin: "male" }));
                                        }}
                                        className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 focus:ring-brand-500 dark:focus:ring-brand-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        required
                                    />
                                    <label htmlFor="male" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Male
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="female"
                                        name="gender"
                                        value="female"
                                        checked={gender === "female"}
                                        onChange={() => {
                                            setGender("female");
                                            setFormData(prev => ({ ...prev, jenis_kelamin: "female" }));
                                        }}
                                        className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 focus:ring-brand-500 dark:focus:ring-brand-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="female" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        Female
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* KTM Upload */}
                        <div className="sm:col-span-2">
                            <Label htmlFor="ktm_url">
                                Update Student Card (KTM)
                            </Label>
                            {currentKtm && (
                                <div className="mb-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Current file:</p>
                                    <a
                                        href={`${BASE_URL}${currentKtm}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-brand-500 hover:underline"
                                    >
                                        View current KTM
                                    </a>
                                </div>
                            )}
                            <FileInput
                                id="ktm_url"
                                name="ktm_url"
                                accept="image/jpeg, image/png, image/jpg"
                                helperText="Upload new student card (JPG or PNG, max 2MB)"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-600 border border-gray-500 rounded"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting || !hasChanges()}
                        >
                            {isSubmitting ? "Updating..." : "Update Data"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}