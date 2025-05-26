import { useQuery } from "@tanstack/react-query";
import { getDeviceLogs } from "../../../../api/devices_api.ts";
import { useParams } from "react-router";
import { Button, Flex, InputNumber, Typography } from "antd";
import { Editor } from "@monaco-editor/react";
import styles from "./LogsTab.module.css";
import { useState } from "react";

export const LogsTab = () => {
  const { device } = useParams();
  const [linesCount, setLinesCount] = useState<number>(20);

  const { data, refetch } = useQuery({
    queryKey: ["logs"],
    queryFn: () => getDeviceLogs(Number(device), linesCount),
  });

  return (
    <Flex vertical justify="center" align="center">
      <Flex
        justify="end"
        align="center"
        style={{ width: "100%", padding: 10 }}
        gap={10}
      >
        <Typography.Text>Количество записей</Typography.Text>
        <InputNumber
          value={linesCount}
          onInput={(value) => setLinesCount(Number(value))}
        />
        <Button onClick={() => refetch()} type="primary">
          Обновить
        </Button>
      </Flex>
      {data && (
        <Editor
          width="100%"
          defaultLanguage="javascript"
          className={styles.editor}
          value={data.data}
        />
      )}
    </Flex>
  );
};
