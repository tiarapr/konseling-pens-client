import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import PageMeta from "../../../components/common/PageMeta";
import api from "../../../api/api";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);

  const mapKonselingToEvents = (konselingList) => {
    return konselingList.map((k) => {
      const tanggal = k.tanggal_konseling.split("T")[0];
      const start = new Date(`${tanggal}T${k.jam_mulai}`);
      const end = new Date(`${tanggal}T${k.jam_selesai}`);

      let calendarColor = "Primary";
      if (k.status && k.status.warna) {
        switch (k.status.warna) {
          case "info":
            calendarColor = "Primary";
            break;
          case "danger":
            calendarColor = "Danger";
            break;
          case "success":
            calendarColor = "Success";
            break;
          case "warning":
            calendarColor = "Warning";
            break;
          default:
            calendarColor = "Primary";
        }
      }

      return {
        id: k.id,
        title: `${k.mahasiswa}`,
        start: start.toISOString(),
        end: end.toISOString(),
        extendedProps: {
          tipe_konsultasi: k.tipe_konsultasi,
          konselor: k.konselor,
          lokasi: k.lokasi,
          status: k.status?.name || "",
          calendar: calendarColor,
          status_kehadiran: k.status_kehadiran,
          tanggal: tanggal,
          jam_mulai: k.jam_mulai,
          jam_selesai: k.jam_selesai,
        },
      };
    });
  };

  const renderEventContent = (eventInfo) => {
    const { calendar, jam_mulai, jam_selesai } = eventInfo.event.extendedProps;
    const colorClass = `fc-bg-${calendar.toLowerCase()}`;
    const viewType = eventInfo.view.type;

    return (
      <div
        className={`fc-event-custom ${colorClass}`}
        style={{
          fontSize: "10px",
          lineHeight: "1.2",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold">{eventInfo.event.title}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {eventInfo.event.extendedProps.konselor || "Konselor Tidak Diketahui"}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {eventInfo.event.extendedProps.lokasi || "Lokasi Tidak Diketahui"}
        </div>
        {viewType === "dayGridMonth" && (
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {jam_mulai} - {jam_selesai}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    async function fetchKonseling() {
      try {
        const res = await api.get("/konseling");
        // Cek respon utama dulu
        if (res.data.status === "success" && res.data.data?.konseling) {
          // Filter hanya konseling dengan status yang diinginkan
          const filteredKonseling = res.data.data.konseling.filter((k) =>
            ["dijadwalkan", "dijadwalkan ulang", "berlangsung"].includes(k.status.name.toLowerCase())
          );

          const konselingEvents = mapKonselingToEvents(filteredKonseling);
          setEvents(konselingEvents);
        } else {
          console.error("Gagal memuat data konseling");
        }
      } catch (error) {
        console.error("Error fetch konseling:", error);
      }
    }

    fetchKonseling();
  }, []);

  return (
    <>
      <PageMeta
        title="Konseling PENS Dashboard | Kalender Konseling"
        description="Halaman kalender untuk jadwal konseling"
      />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={true}
            eventContent={renderEventContent}
          />
        </div>
      </div>
    </>
  );
};

export default Calendar;
