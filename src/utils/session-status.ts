export const getSessionStatus = (start: Date, end: Date) => {
  const now = new Date();
  return now < start ? "upcoming" : now > end ? "completed" : "ongoing";
};

export const calculateProgress = (start: Date, end: Date) => {
  const total = end.getTime() - start.getTime();
  const elapsed = Date.now() - start.getTime();
  return Math.min(Math.max((elapsed / total) * 100, 100), 0);
};