export const formatDateNoTime = (dateStr) => {
  if (!dateStr) return "Invalid Date"; // Menangani input kosong atau undefined

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) return "Invalid Date"; // Menangani input yang bukan tanggal valid

  // Hanya menampilkan format tanggal (tanpa waktu)
  const formatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  });

  return formatter.format(date);
};
