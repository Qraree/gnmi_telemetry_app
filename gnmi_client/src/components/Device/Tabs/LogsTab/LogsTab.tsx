import { useQuery } from "@tanstack/react-query";
import { getDeviceLogs } from "../../../../api/devices_api.ts";
import { useParams } from "react-router";
import { Button, Flex } from "antd";
import { Editor } from "@monaco-editor/react";
import styles from "./LogsTab.module.css";

export const LogsTab = () => {
  const { device } = useParams();

  const { data, refetch } = useQuery({
    queryKey: ["logs"],
    queryFn: () => getDeviceLogs(Number(device)),
  });

  return (
    <Flex vertical justify="center" align="center">
      <Button className={styles.updateButton} onClick={() => refetch()}>
        Обновить
      </Button>
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
