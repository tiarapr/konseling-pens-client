import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Indonesian } from "flatpickr/dist/l10n/id"; // Optional: for localization
import Label from "./Label";
import { CalenderIcon } from "@/icons";

export default function DatePicker({
  id,
  mode = "single",
  onChange,
  label,
  defaultDate,
  placeholder,
  required = false,
  minDate,
  maxDate,
  disabled = false,
  className = "",
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const flatPickrInstance = flatpickr(inputRef.current, {
      mode,
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      altFormat: "Y-m-d",  // Format alternatif
      altInput: true,      // Tampilkan input alternatif
      defaultDate,
      minDate,
      maxDate,
      disableMobile: true,
      locale: Indonesian,
      onChange: (selectedDates, dateStr) => {
        if (onChange) {
          // Kirim string tanggal format YYYY-MM-DD
          onChange(dateStr);
        }
      },
    });

    return () => {
      flatPickrInstance.destroy();
    };
  }, [mode, onChange, defaultDate, minDate, maxDate]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          placeholder={placeholder}
          className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800 ${disabled ? "cursor-not-allowed opacity-50" : ""
            }`}
          required={required}
          disabled={disabled}
          data-input // Required for flatpickr
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}