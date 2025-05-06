import { Tooltip } from "antd";

interface Props {
  ns: number | bigint | string;
  locale?: string; // Например, "ru-RU"
  showTime?: boolean;
}

export const NanoTimestamp = ({
  ns,
  locale = "ru-RU",
  showTime = true,
}: Props) => {
  if (!ns) return <>—</>;

  const ms =
    typeof ns === "bigint"
      ? Number(ns / 1000000n)
      : Math.floor(Number(ns) / 1_000_000);
  const date = new Date(ms);

  const formatted = date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(showTime && {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  });

  return (
    <Tooltip title={date.toISOString()}>
      <span>{formatted}</span>
    </Tooltip>
  );
};
