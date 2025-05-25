export const getMemoryData = (used: number, free: number, total: number) => {
  const toGB = (bytes: number) => (bytes / 1024 / 1024 / 1024).toFixed(2);
  const usedPercent = ((used / total) * 100).toFixed(1);
  const freePercent = ((free / total) * 100).toFixed(1);

  const data = {
    labels: [
      `Использовано (${toGB(used)} GB, ${usedPercent}%)`,
      `Свободно (${toGB(free)} GB, ${freePercent}%)`,
    ],
    datasets: [
      {
        label: "Дисковое пространство",
        data: [used, free],
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

  return {
    data,
    options,
  };
};
