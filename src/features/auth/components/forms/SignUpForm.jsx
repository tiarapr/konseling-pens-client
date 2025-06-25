import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Radio from "@/components/form/input/Radio";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import FileInput from "@/components/form/input/FileInput";
import api from "@/api/api";
import Swal from "sweetalert2";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [studyProgram, setStudyProgram] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programOptions, setProgramOptions] = useState([]);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await api.get("/program-studi");
        const options = response.data.data.programStudi.map((item) => ({
          value: item.id,
          label: `${item.jenjang} ${item.nama_program_studi}`,
        }));
        setProgramOptions(options);
      } catch (error) {
        console.error("Gagal memuat program studi:", error.message);
        setFetchError("Gagal memuat daftar program studi.");
      }
    };

    fetchPrograms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = e.target;
      const formData = new FormData();

      const ktmFile = form.ktm_url.files[0];
      if (ktmFile && ktmFile.size > 2 * 1024 * 1024) {
        Swal.fire("Error", "Ukuran file tidak boleh lebih dari 2MB.", "error");
        setIsSubmitting(false);
        return;
      }

      formData.append("nama_lengkap", form.nama_lengkap.value);
      formData.append("email", form.email.value);
      formData.append("password", form.password.value);
      formData.append("phoneNumber", form.phoneNumber.value);
      formData.append("nrp", form.nrp.value);
      formData.append("program_studi_id", studyProgram);
      formData.append("tanggal_lahir", birthDate);
      formData.append("jenis_kelamin", gender === "male" ? "L" : "P");
      formData.append("ktm_url", ktmFile);

      const response = await api.post("/mahasiswa", formData);

      Swal.fire("Sukses", response.data.message || "Pendaftaran berhasil!", "success");
    } catch (error) {
      const message =
        error.response?.data?.message || "Terjadi kesalahan saat mendaftar.";
      Swal.fire("Gagal", message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto py-10 lg:w-1/2">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="w-full max-w-md pb-10 mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon className="size-5" />
            Kembali ke Beranda
          </Link>
        </div>

        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Daftar Akun
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Masukkan data diri untuk membuat akun.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="nama_lengkap">
                  Nama Lengkap<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="nama_lengkap"
                  name="nama_lengkap"
                  placeholder="Masukkan nama lengkap"
                  required
                  minLength={3}
                  maxLength={100}
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="email">
                  Email PENS<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="user@it.student.pens.ac.id"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="password">
                  Kata Sandi<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Minimal 8 karakter, huruf besar, kecil & angka"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    minLength={8}
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$"
                    title="Password minimal 8 karakter, termasuk huruf besar, kecil, dan angka"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 right-4 top-1/2"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-1">
                <Label htmlFor="phoneNumber">
                  No. WhatsApp<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="628812345678"
                  required
                />
              </div>

              <div className="sm:col-span-1">
                <Label htmlFor="nrp">
                  NRP<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="nrp"
                  name="nrp"
                  placeholder="Masukkan NRP (10 digit)"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="studyProgram">
                  Program Studi<span className="text-error-500">*</span>
                </Label>
                <Select
                  id="studyProgram"
                  options={programOptions}
                  placeholder="Pilih program studi"
                  required
                  onChange={(value) => setStudyProgram(value)}
                />
                {fetchError && (
                  <p className="mt-2 text-sm text-red-500">{fetchError}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <DatePicker
                  id="date-picker"
                  label="Tanggal Lahir"
                  placeholder="Pilih tanggal lahir"
                  onChange={(dateStr) => setBirthDate(dateStr)}
                  required
                  maxDate={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="sm:col-span-2">
                <Label>Jenis Kelamin<span className="text-error-500">*</span></Label>
                <div className="flex gap-4 mt-2">
                  <Radio
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={() => setGender("male")}
                    label="Laki-laki"
                    required
                  />
                  <Radio
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={() => setGender("female")}
                    label="Perempuan"
                  />
                </div>
              </div>

              {/* Upload KTM */}
              <div className="sm:col-span-2">
                <Label htmlFor="ktm_url">
                  Unggah KTM<span className="text-error-500">*</span>
                </Label>
                <FileInput
                  id="ktm_url"
                  name="ktm_url"
                  accept="image/jpeg, image/png, image/jpg"
                  required
                  helperText="Unggah kartu tanda mahasiswa (JPG/PNG, maks 2MB)"
                />
              </div>
            </div>

            {/* Tombol Submit */}
            <div>
              <button
                type="submit"
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mengirim..." : "Daftar"}
              </button>
            </div>

            {/* Link Login */}
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Sudah punya akun?{" "}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Masuk
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}