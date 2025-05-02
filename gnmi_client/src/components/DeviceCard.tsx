import { useLocation } from "react-router";

export const DeviceCard = () => {
  const location = useLocation();
  return <div>{location.pathname}</div>;
};
