import { LayoutPage } from "../PageLayout.tsx";
import { Editor } from "@monaco-editor/react";
import styles from "./DeployPage.module.css";
import { deployTemplate } from "./deployTemplate.ts";
import { Button, Card, Flex, Spin, Typography } from "antd";

export const DeployPage = () => {
  return (
    <LayoutPage title="Развертывание топологии">
      <Flex>
        <Editor
          className={styles.editor}
          defaultLanguage="json"
          width={"50%"}
          defaultValue={JSON.stringify(deployTemplate, null, 4)}
        />
        <Flex vertical style={{ padding: 10 }} gap={10}>
          <Card style={{ border: "1px solid gray" }}>
            Укажите топологию сети в формате JSON и нажмите "Развернуть", чтобы
            запустить инфраструктуру через Containerlab.
          </Card>
          <Button type="primary" style={{ width: "20%" }} onClick={() => {}}>
            Развернуть
          </Button>
          <Flex
            vertical
            justify="center"
            align="center"
            style={{
              padding: 50,
              border: "1px solid gray",
              borderRadius: 10,
              flexGrow: 1,
            }}
            gap={20}
          >
            <Typography.Title level={4}>
              Развёртывание сети. Подождите завершения операции.
            </Typography.Title>
            <Spin size="large" />
          </Flex>
        </Flex>
      </Flex>
    </LayoutPage>
  );
};
