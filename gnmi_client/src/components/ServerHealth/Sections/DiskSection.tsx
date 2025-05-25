import { ChartLayout } from "../ChartLayout.tsx";
import { Bar, Doughnut } from "react-chartjs-2";
import { Descriptions, Flex } from "antd";
import { DiskMetrics } from "../../../types/server-health.ts";
import { SectionLayout } from "../SectionLayout.tsx";
import { getDoughnutChartPctData } from "../ChartTemplates/DoughnutData.ts";

interface DiskSectionProps {
  diskData: DiskMetrics;
}

export const DiskSection = ({ diskData }: DiskSectionProps) => {
  const toGB = (bytes: number) => (bytes / 1024 / 1024 / 1024).toFixed(2);
  const usedPercent = ((diskData.usedDisk / diskData.totalDisk) * 100).toFixed(
    1,
  );
  const freePercent = ((diskData.freeDisk / diskData.totalDisk) * 100).toFixed(
    1,
  );

  const data = {
    labels: [
      `Использовано (${toGB(diskData.usedDisk)} GB, ${usedPercent}%)`,
      `Свободно (${toGB(diskData.freeDisk)} GB, ${freePercent}%)`,
    ],
    datasets: [
      {
        label: "Дисковое пространство",
        data: [diskData.usedDisk, diskData.freeDisk],
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
        display: true,
        text: `Использование диска: ${diskData.path}`,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: ${toGB(value)} GB (${((value / diskData.totalDisk) * 100).toFixed(1)}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: function (value: any) {
            return toGB(value) + " GB";
          },
        },
        title: {
          display: true,
          text: "Объем (GB)",
        },
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <SectionLayout title="Диск">
      <Descriptions
        style={{ marginBottom: 20, width: "20%" }}
        bordered
        items={[
          {
            key: "1",
            label: "Путь",
            children: diskData.path,
          },
        ]}
      />
      <Flex gap={10} style={{ width: "100%" }}>
        <ChartLayout title="Дисковое пространство в %" width="20%" height={350}>
          <Doughnut data={getDoughnutChartPctData(diskData.usagePercent)} />
        </ChartLayout>
        <ChartLayout
          title="Использование дискового пространства"
          width="80%"
          height={350}
        >
          <Bar data={data} options={options} />
        </ChartLayout>
      </Flex>
    </SectionLayout>
  );
};
