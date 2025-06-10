import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { getAverageRating } from "@/services/DashboardService"; 

export default function Rating() {
  const [ratingData, setRatingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        const data = await getAverageRating();
        setRatingData(data.data); 
        setIsLoading(false); 
      } catch (error) {
        console.error("Error fetching rating data:", error);
        setIsLoading(false);
      }
    };

    fetchRatingData();
  }, []);

  // Menghitung nilai rating dalam persen
  const ratingPercentage = ratingData ? (parseFloat(ratingData.averageRating) / 5) * 100 : 0;

  const series = [ratingPercentage];  // Mengubah rata-rata rating menjadi persentase untuk chart

  const options = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";  // Menambahkan "%" ke nilai
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Tingkat Kepuasan Layanan"],  // Mengubah label untuk menyesuaikan dengan konteks rating
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
        <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Tingkat Kepuasan Layanan
              </h3>
              <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                Rata-rata kepuasan pengguna terhadap layanan
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="max-h-[330px]" id="chartDarkStyle">
              <Chart options={options} series={[0]} type="radialBar" height={330} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Tingkat Kepuasan Layanan
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Rata-rata kepuasan pengguna terhadap layanan
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="max-h-[330px]" id="chartDarkStyle">
            <Chart
              key={ratingPercentage}
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Rating
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {ratingData ? ratingData.averageRating : "N/A"} / 5
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Total Ratings
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {ratingData ? ratingData.ratingCount : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
