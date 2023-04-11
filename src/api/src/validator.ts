export const getOptionalNumberParam = (params: qs.ParsedQs, key: string) => {
  const param = params[key];
  if (typeof param === "string" && /^\d+$/.test(param)) {
    return parseInt(param, 10);
  }
  return undefined;
};

export const validateIso8601DateTime = (date: string) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  if (!dateRegex.test(date)) {
    return undefined;
  }
  const d = new Date(date);
  if (d instanceof Date && d.toISOString() === date) {
    return d;
  }
  console.log(d.toISOString());
  return undefined;
};
