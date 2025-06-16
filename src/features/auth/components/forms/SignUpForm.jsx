import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Checkbox from "@/components/form/input/Checkbox";
import Radio from "@/components/form/input/Radio";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import FileInput from "@/components/form/input/FileInput";
import api from "@/api/api";
import { toast } from "react-toastify";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [studyProgram, setStudyProgram] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programOptions, setProgramOptions] = useState([]);

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
        console.error("Failed to fetch study programs:", error.message);
        toast.error("Failed to load study programs. Please try again later.");
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
        toast.error("File size should not exceed 2MB.");
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
      console.log("Registration response:", response.data);

      toast.success(response.data.message || "Registration successful");
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message || "Something went wrong during registration.";
      toast.error(message);
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
            Back to homepage
          </Link>
        </div>

        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your details to create an account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <Label htmlFor="nama_lengkap">
                  Full Name<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="nama_lengkap"
                  name="nama_lengkap"
                  placeholder="Enter your full name"
                  required
                  minLength={3}
                  maxLength={100}
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-1">
                <Label htmlFor="email">
                  NET ID<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="user@it.student.pens.ac.id"
                  required
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  title="Please enter a valid email address"
                />
              </div>

              {/* Password */}
              <div className="sm:col-span-1">
                <Label htmlFor="password">
                  Password<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="At least 8 characters, including uppercase, lowercase, and numbers"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    minLength={8}
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$"
                    title="Password must contain at least 8 characters, including uppercase, lowercase, and numbers"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 right-4 top-1/2"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Phone Number */}
              <div className="sm:col-span-1">
                <Label htmlFor="phoneNumber">
                  Phone Number<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="628812345678"
                  required
                  pattern="[0-9]{10,15}"
                  title="Phone number must be between 10-15 digits"
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
                  placeholder="Select your study program"
                  required
                  onChange={(value) => setStudyProgram(value)}
                />
              </div>

              {/* Birth Date */}
              <div className="sm:col-span-2">
                <DatePicker
                  id="date-picker"
                  label="Birth Date"
                  placeholder="Select your birth date"
                  onChange={(dateStr) => setBirthDate(dateStr)}
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
                  <Radio
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={() => setGender("male")}
                    label="Male"
                    required
                  />
                  <Radio
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={() => setGender("female")}
                    label="Female"
                  />
                </div>
              </div>

              {/* KTM Upload */}
              <div className="sm:col-span-2">
                <Label htmlFor="ktm_url">
                  Upload Student Card (KTM)<span className="text-error-500">*</span>
                </Label>
                <FileInput
                  id="ktm_url"
                  name="ktm_url"
                  accept="image/jpeg, image/png, image/jpg"
                  required
                  helperText="Upload your student card (JPG or PNG, max 2MB)"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3">
              <Checkbox
                className="w-5 h-5 mt-1"
                checked={isChecked}
                onChange={setIsChecked}
                id="terms"
                required
              />
              <label htmlFor="terms" className="text-sm font-normal text-gray-500 dark:text-gray-400">
                By completing this form, you agree to our{" "}
                <Link to="/terms" className="text-brand-500 hover:underline">
                  Terms and Conditions
                </Link>, and our{" "}
                <Link to="/privacy" className="text-brand-500 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || !isChecked}
              >
                {isSubmitting ? "Submitting..." : "Sign Up"}
              </button>
            </div>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}