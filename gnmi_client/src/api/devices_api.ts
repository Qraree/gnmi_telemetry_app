export const getAllDevices = async () => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${baseUrl}/devices`);
  return await response.json();
};

export const getAllConnections = async () => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${baseUrl}/devices/connections`);
  return await response.json();
};

export const testRPCRequest = async (): Promise<void> => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${baseUrl}/test`);
  return await response.json();
};

export const testSSHRequest = async (): Promise<void> => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${baseUrl}/test/connections`);
  return await response.json();
};
