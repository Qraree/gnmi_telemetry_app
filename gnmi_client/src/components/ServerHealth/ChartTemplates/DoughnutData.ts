export const getDoughnutChartPctData = (usagePercent: number) => {
  return {
    labels: ["Используется", "Всего"],
    datasets: [
      {
        label: "Ram Usage",
        data: [usagePercent, 100 - usagePercent],
        backgroundColor: ["rgba(255,99,132,0.7)", "rgba(54,162,235,0.7)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(255, 159, 64, 1)"],
        borderWidth: 1,
      },
    ],
  };
};
