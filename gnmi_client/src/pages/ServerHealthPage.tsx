import { LayoutPage } from "./PageLayout.tsx";
import { useQuery } from "@tanstack/react-query";
import { getServerHealth } from "../api/server_health_api.ts";
import { Descriptions, DescriptionsProps, Flex } from "antd";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";
import { DiskSection } from "../components/ServerHealth/Sections/DiskSection.tsx";
import { CPUSection } from "../components/ServerHealth/Sections/CPUSection.tsx";
import { MemorySection } from "../components/ServerHealth/Sections/MemorySection.tsx";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  LineElement,
  Legend,
  PointElement,
);

export const ServerHealthPage = () => {
  const { data } = useQuery({
    queryKey: ["serverHealth"],
    queryFn: getServerHealth,
  });

  const descriptionItems: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Версия",
      children: <p>{data?.data?.serverInfo?.version}</p>,
    },
    {
      key: "2",
      label: "Время работы",
      children: <p>{data?.data?.serverInfo?.uptime}</p>,
    },
    {
      key: "3",
      label: "Время начала работы",
      children: <p>{data?.data?.serverInfo?.startTime}</p>,
    },
  ];

  return (
    <LayoutPage title="Состояние сервера">
      {data && (
        <Descriptions items={descriptionItems} layout="vertical" bordered />
      )}

      <Flex vertical style={{ padding: 15 }}>
        {data && <DiskSection diskData={data.data.metrics.disk} />}
      </Flex>
      <Flex vertical style={{ padding: 15 }}>
        {data && <CPUSection cpuData={data.data.metrics.cpu} />}
      </Flex>
      <Flex vertical style={{ padding: 15 }}>
        {data && <MemorySection memoryData={data.data.metrics.mem} />}
      </Flex>
    </LayoutPage>
  );
};
