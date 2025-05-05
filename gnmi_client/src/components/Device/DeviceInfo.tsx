import { useTheme } from "../../hooks/useTheme.tsx";
import { useQuery } from "@tanstack/react-query";
import { getOneDevice } from "../../api/devices_api.ts";
import { useParams } from "react-router";

export const DeviceInfo = () => {
  const { theme } = useTheme();
  const { device } = useParams();

  const { data, isPending } = useQuery({
    queryKey: ["device"],
    queryFn: () => getOneDevice(Number(device)),
  });

  if (isPending || !data) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{ background: theme.primaryColor }}
    >
      <div
        className="max-w-3xl rounded-2xl shadow-lg p-8"
        style={{ background: theme.colorFillSecondary }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{data?.name}</h1>
            <p className="text-sm text-gray-500">{data?.image.toUpperCase()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm">IP-адрес</p>
            <p className="font-medium">{data?.container_ipv4_address}</p>
          </div>
          <div>
            <p className=" text-sm">MAC-адрес</p>
            <p className="font-medium">462374-fwe3-432-few2</p>
          </div>
          <div>
            <p className="text-sm">Операционная система</p>
            <p className="font-medium">{data?.image}</p>
          </div>
          <div>
            <p className=" text-sm">Состояние</p>
            <p
              className={`font-medium ${data?.state === "running" ? "text-green-600" : "text-red-600"}`}
            >
              {data?.state}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
