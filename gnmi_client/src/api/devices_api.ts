export const getAllDevices = async () => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const response = await fetch(`${baseUrl}/devices`);
  return await response.json();
};
