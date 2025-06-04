import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import { useState } from "react";
import api from "../../../api/api";
import { FaStar } from "react-icons/fa";

export default function RatingModal({ isOpen, closeModal, konselingId, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [ulasan, setUlasan] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await api.post(`/konseling/${konselingId}/rating`, {
                konseling_id: konselingId,
                rating,
                ulasan,
            });
            onSuccess(); // Refresh data or give feedback
            closeModal();
        } catch (error) {
            console.error("Gagal menyimpan rating:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
            <div className="w-full rounded-2xl bg-white p-6 dark:bg-gray-900">
                <h4 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white/90">
                    Beri Rating Konseling
                </h4>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                    Nilai pengalaman konseling Anda.
                </p>

                <div className="my-4">
                    <Label>Rating</Label>
                    <div className="flex space-x-1 mt-2">
                        {[...Array(5)].map((_, index) => {
                            const value = index + 1;
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setRating(value)}
                                    onMouseEnter={() => setHover(value)}
                                    onMouseLeave={() => setHover(null)}
                                >
                                    <FaStar
                                        className={`w-8 h-8 cursor-pointer transition-colors ${value <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="my-6">
                    <Label>Ulasan (Opsional)</Label>
                    <textarea
                        rows={4}
                        className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
                        placeholder="Tuliskan ulasan Anda di sini..."
                        value={ulasan}
                        onChange={(e) => setUlasan(e.target.value)}
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" size="sm" onClick={closeModal}>
                        Batal
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={rating === 0 || loading}
                    >
                        {loading ? "Menyimpan..." : "Kirim Rating"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
