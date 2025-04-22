export const getAllDevices = async () => {
  const response = await fetch(import.meta.env.VITE_SERVER_URL);
  return await response.json();
};
