export const formatDate = (dateStr) => {
  if (!dateStr) return "Invalid Date"; // Menangani input kosong atau undefined

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) return "Invalid Date"; // Menangani input yang bukan tanggal valid

  const formatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return formatter.format(date);
};
