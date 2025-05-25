import { SectionLayout } from "../SectionLayout.tsx";
import { CPUMetrics } from "../../../types/server-health.ts";
import { ChartLayout } from "../ChartLayout.tsx";
import { Bar, Doughnut } from "react-chartjs-2";
import { Descriptions, Flex } from "antd";
import { getDoughnutChartPctData } from "../ChartTemplates/DoughnutData.ts";

interface Props {
  cpuData: CPUMetrics;
}

export const CPUSection = ({ cpuData }: Props) => {
  const loadAvgData = {
    labels: ["1 мин", "5 мин", "15 мин"],
    datasets: [
      {
        label: "Средняя нагрузка за прошедшее время",
        data: [cpuData.loadAvg1, cpuData.loadAvg5, cpuData.loadAvg15],
        borderColor: "rgb(72,125,204)",
        backgroundColor: "rgba(75,108,192,0.7)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <SectionLayout title="Процессор">
      <Descriptions
        style={{ marginBottom: 20, width: "20%" }}
        bordered
        items={[
          {
            key: "1",
            label: "Количество ядер",
            children: cpuData.numCPU,
          },
        ]}
      />
      <Flex gap={10} style={{ width: "100%" }}>
        <ChartLayout title="Ресурсы процессора в %" width="20%" height={350}>
          <Doughnut data={getDoughnutChartPctData(cpuData.usagePercent)} />
        </ChartLayout>
        <ChartLayout title="Ресуры процесса в %" width="20%" height={350}>
          <Doughnut data={getDoughnutChartPctData(cpuData.processPercent)} />
        </ChartLayout>
        <ChartLayout title="Средняя нагрузка" width="60%" height={350}>
          <Bar data={loadAvgData} options={{ maintainAspectRatio: false }} />
        </ChartLayout>
      </Flex>
    </SectionLayout>
  );
};
