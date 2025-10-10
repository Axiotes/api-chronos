export const buildSelectObject = (
  fields: string[],
  allowed: string[],
):
  | {
      [k: string]: boolean;
    }
  | undefined => {
  if (!fields || fields.length === 0) {
    return undefined;
  }

  const safeFields = fields.filter((f) => allowed.includes(f));
  const select = safeFields.length
    ? Object.fromEntries(safeFields.map((f) => [f, true]))
    : undefined;

  return select;
};
