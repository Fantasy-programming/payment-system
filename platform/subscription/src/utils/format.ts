
export function formatDate(dateStr: string | Date): string {
  const date = new Date(dateStr);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  return formattedDate;
}
