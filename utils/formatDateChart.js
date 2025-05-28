export const formattedDataChart = {
    labels: apiData?.data?.months || [], // Pastikan label bulan tersedia
    datasets: [
      {
        label: "Total Guru",
        data: apiData?.data?.total_guru || [],
        borderColor: "rgb(75, 192, 192)", // Warna garis
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Total Siswa",
        data: apiData?.data?.total_siswa || [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Total Latihan",
        data: apiData?.data?.total_latihan || [],
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
    ],
  };
  D