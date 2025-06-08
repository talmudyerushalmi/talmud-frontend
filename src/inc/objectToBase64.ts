export const objectToBase64 = (obj: Record<string, any>) => {
  const json = JSON.stringify(obj);
  return Buffer.from(json).toString('base64');
};
