const formatDate = (date: string | Date) => {
  const d = new Date(date);
  const now = new Date();

  const pad = (n: number) => n.toString().padStart(2, "0");
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear() % 100;
  const hour = pad(d.getHours());
  const minute = pad(d.getMinutes());

  const isToday = d.toDateString() === now.toDateString();
  const isYesterday =
    new Date(now.setDate(now.getDate() - 1)).toDateString() ===
    d.toDateString();

  if (isToday) return `Hôm nay, ${hour}:${minute}`;
  if (isYesterday) return `Hôm qua, ${hour}:${minute}`;

  return `${day}/${month}/${year
    .toString()
    .padStart(2, "0")} ${hour}:${minute}`;
};

export default formatDate;
