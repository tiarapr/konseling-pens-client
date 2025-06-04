import { useEffect, useState } from "react";
import api from "../../../api/api";
import { FaCamera, FaTimes } from "react-icons/fa";
import Input from "../../form/input/InputField";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function KemahasiswaanProfileCard() {
  const [kemahasiswaan, setKemahasiswaan] = useState(null);
  const [role, setRole] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const cancelPhotoUpload = () => {
    setPhoto(null);
    setIsPhotoUploaded(false);
  };

  // Fetch kemahasiswaan data
  const fetchKemahasiswaanProfile = async () => {
    try {
      const response = await api.get("/kemahasiswaan-profil/me");
      const profil = response.data.data.kemahasiswaanProfil;
      setKemahasiswaan(profil);
      setEditedData({
        nama_lengkap: profil.nama_lengkap,
        jabatan: profil.jabatan,
        nip: profil.nip
      });
    } catch (error) {
      console.error("Error fetching kemahasiswaan profile data:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = JSON.parse(storedUser);
    setRole(user.role_name || "kemahasiswaan");

    fetchKemahasiswaanProfile();
  }, []);

  // Handle input changes for edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // When entering edit mode, initialize editedData with current values
      setEditedData({
        nama_lengkap: kemahasiswaan.nama_lengkap,
        jabatan: kemahasiswaan.jabatan,
        nip: kemahasiswaan.nip
      });
    }
  };

  // Save edited data
  const saveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await api.patch(`/kemahasiswaan-profil/me/${kemahasiswaan.id}`, editedData);
      setKemahasiswaan(response.data.data.kemahasiswaanProfil);
      setIsEditing(false);
      alert("Profile updated successfully!");

      await fetchKemahasiswaanProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // Upload photo handler
  const uploadPhotoHandler = async (e) => {
    e.preventDefault();

    if (!photo) {
      alert("Please select a photo to upload.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("photo", photo);

    try {
      const response = await api.post(`/kemahasiswaan-profil/${kemahasiswaan.id}/photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setKemahasiswaan((prevkemahasiswaan) => ({
        ...prevkemahasiswaan,
        photo_url: response.data.data.kemahasiswaanProfil.photo_url,
      }));

      setIsPhotoUploaded(true);
      setPhoto(null);
      alert("Profile photo updated successfully.");
      fetchKemahasiswaanProfile()
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      alert("Failed to upload profile photo.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!kemahasiswaan) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 relative">

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative flex flex-col w-full gap-6 xl:flex-row">
          <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 relative">
            <img
                src={
                  photo ? URL.createObjectURL(photo) : 
                  kemahasiswaan.photo_url ? `${BASE_URL}${kemahasiswaan.photo_url}` : "/images/profile/default-profile.png"
                }
                alt="user"
                className="w-full h-full object-cover"
              />
            <label
              htmlFor="photo-upload"
              className="absolute bottom-2 right-0 bg-blue-500 p-2 rounded-full cursor-pointer text-white"
            >
              <FaCamera />
            </label>
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              style={{ display: "none" }}
            />
          </div>

          <div className="order-3 xl:order-2">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  type="text"
                  name="nama_lengkap"
                  value={editedData.nama_lengkap}
                  onChange={handleInputChange}
                  className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90 text-left"
                />
                <Input
                  type="text"
                  name="jabatan"
                  value={editedData.jabatan}
                  onChange={handleInputChange}
                  className="text-sm text-gray-500 dark:text-gray-400 mb-4"
                  placeholder="Specialization"
                />
                <Input
                  type="text"
                  name="nip"
                  value={editedData.nip}
                  onChange={handleInputChange}
                  className="text-sm text-gray-500 dark:text-gray-400"
                  placeholder="nip Number"
                />
              </div>
            ) : (
              <div>
                <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90 text-left">
                  {kemahasiswaan.nama_lengkap || "Name not available"}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>

                <div className="text-left mt-4 space-y-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>NIP:</strong> {kemahasiswaan.nip || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Specialization:</strong> {kemahasiswaan.jabatan || "Not specified"}
                  </p>
                </div>
                <div className="flex flex-col gap-1 mt-4 space-y-4 xl:flex-row xl:gap-3 text-left">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Joined on:</strong> {new Date(kemahasiswaan.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <strong>Last updated:</strong> {new Date(kemahasiswaan.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Button Group untuk Edit/Save/Cancel */}
      <div className="absolute top-4 right-4 flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={saveProfile}
              type="button"
              className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
            <button
              onClick={toggleEdit}
              type="button"
              className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={toggleEdit}
            type="button"
            className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill="currentColor"
              />
            </svg>
            Update Profile
          </button>
        )}
      </div>

      <div className="relative">
        {/* Photo Upload Actions */}
        {photo && !isPhotoUploaded && (
          <div className="mt-3 flex gap-2 justify-center">
            <button
              onClick={uploadPhotoHandler}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              disabled={isUploading}
            >
              {isUploading ? (
                "Uploading..."
              ) : (
                <>
                  <span>Save Photo</span>
                </>
              )}
            </button>
            <button
              onClick={cancelPhotoUpload}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              <FaTimes className="text-xs" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}