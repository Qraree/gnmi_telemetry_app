import { SectionLayout } from "../SectionLayout.tsx";
import { MemoryMetrics } from "../../../types/server-health.ts";
import { Bar, Doughnut } from "react-chartjs-2";
import { ChartLayout } from "../ChartLayout.tsx";
import { Flex } from "antd";
import { getDoughnutChartPctData } from "../ChartTemplates/DoughnutData.ts";

interface MemorySectionProps {
  memoryData: MemoryMetrics;
}

export const MemorySection = ({ memoryData }: MemorySectionProps) => {
  const toMB = (bytes: number) => (bytes / 1024 / 1024).toFixed(2);
  const usedPercent = (
    (memoryData.usedMem / memoryData.totalMem) *
    100
  ).toFixed(1);
  const freePercent = (
    (memoryData.availableMem / memoryData.totalMem) *
    100
  ).toFixed(1);

  const data = {
    labels: [
      `Использовано (${toMB(memoryData.usedMem)} MB, ${usedPercent}%)`,
      `Свободно (${toMB(memoryData.availableMem)} MB, ${freePercent}%)`,
    ],
    datasets: [
      {
        label: "Использование ОЗУ",
        data: [memoryData.usedMem, memoryData.availableMem],
        backgroundColor: ["rgba(255, 99, 132, 0.7)", "rgba(54, 162, 235, 0.7)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: `Использование ОЗУ`,
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: function (value: any) {
            return toMB(value) + " MB";
          },
        },
        title: {
          display: true,
          text: "Объем (MB)",
        },
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <SectionLayout title="ОЗУ">
      <Flex gap={10} style={{ width: "100%" }}>
        <ChartLayout title="Ресурсы ОЗУ в %" width="20%" height={350}>
          <Doughnut data={getDoughnutChartPctData(memoryData.usagePercent)} />
        </ChartLayout>
        <ChartLayout title="Ресурсы ОЗУ процесса в %" width="20%" height={350}>
          <Doughnut data={getDoughnutChartPctData(memoryData.processMemPct)} />
        </ChartLayout>
        <ChartLayout title="Использование ОЗУ" width="80%" height={350}>
          <Bar data={data} options={options} />
        </ChartLayout>
      </Flex>
    </SectionLayout>
  );
};
