import { DeviceListCard } from "./DeviceListCard.tsx";
import { useQuery } from "@tanstack/react-query";
import { getAllDevices } from "../api/devices_api.ts";
import { Device } from "../types/device.ts";

export default function DeviceList() {
  const { isPending, error, data } = useQuery({
    queryKey: ["devices"],
    queryFn: getAllDevices,
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      {data &&
        data?.map((device: Device) => (
          <DeviceListCard key={device.id} device={device} />
        ))}
    </div>
  );
}
