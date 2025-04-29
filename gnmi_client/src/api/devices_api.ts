export const getAllDevices = async () => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${baseUrl}/devices`);
  return await response.json();
};

export const testRPCRequest = async (): Promise<void> => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${baseUrl}/test`);
  return await response.json();
};
