const getDateRange = (range) => {
  const now = new Date();
  let start = new Date();
  const end = new Date(); // Current time

  switch (range) {
    case "daily":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "weekly":
      const dayOfWeek = now.getDay();
      const firstDayOfWeek = now.getDate() - dayOfWeek;
      start = new Date(now.setDate(firstDayOfWeek));
      start.setHours(0, 0, 0, 0);
      break;
    case "monthly":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "yearly":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1); // default monthly
  }

  return { start, end };
};

export default getDateRange;
