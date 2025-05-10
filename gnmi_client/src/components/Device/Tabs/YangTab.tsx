import { Button, Flex, Result, Select, Steps, Tree } from "antd";
import { openconfigModules } from "../../../utils/openconfig-modules.ts";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDeviceYang } from "../../../api/devices_api.ts";
import { useParams } from "react-router";
import { useConvertJsonToTree } from "../../../hooks/useConvertJsonToTree.tsx";
import { DiffEditor, Editor } from "@monaco-editor/react";
import styles from "./YangTub.module.css";

export const YangTab = () => {
  const { device } = useParams();
  const [yangQuery, setYangQuery] = useState<string>(openconfigModules[0]);
  const [configureStep, setConfigureStep] = useState<number>(0);
  const [editedValue, setEditedValue] = useState<string | undefined>(undefined);

  const { data, refetch } = useQuery({
    queryKey: ["yang", yangQuery],
    queryFn: () => getDeviceYang<any>(Number(device), [yangQuery]),
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const handleChange = (value: string) => {
    setYangQuery(() => value);
  };

  const handleSubmitChanges = () => {
    setConfigureStep(2);
  };

  const handleReturnToEdit = () => {
    setConfigureStep(1);
  };

  const handleSendChanges = (value: string) => {
    console.log(value);
    setConfigureStep(3);
  };

  const { tree, jsonResponse } = useConvertJsonToTree(
    data?.notification?.[0]?.update?.[0]?.val,
    setConfigureStep,
    setEditedValue,
  );

  const newOperation = () => {
    setEditedValue(undefined);
    setConfigureStep(0);
  };

  useEffect(() => {
    console.log(data);
    refetch();
  }, [yangQuery]);

  if (configureStep === 3) {
    return (
      <Flex justify="center" align="center">
        <Result
          status="success"
          title="Успешно загружена конфигурация"
          extra={[
            <Button type="primary" key="console" onClick={newOperation}>
              Новая операция
            </Button>,
          ]}
        />
      </Flex>
    );
  }
  return (
    <Flex style={{ height: "80vh" }}>
      {configureStep < 2 ? (
        <Flex style={{ width: "100%", height: "85%" }}>
          <Flex vertical>
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              defaultValue={openconfigModules[0]}
              style={{ width: 400, marginBottom: 20 }}
              onChange={handleChange}
              options={openconfigModules.map((item) => ({
                value: item,
                label: item,
              }))}
            />
            {tree && <Tree treeData={tree} />}
          </Flex>
          <Flex vertical style={{ width: "70%" }} align="end">
            <Editor
              width="100%"
              className={styles.editor}
              defaultLanguage="javascript"
              value={editedValue}
              onChange={(value) => setEditedValue(value)}
              defaultValue="// Выберите участок конфигурации"
            />
            <Button
              style={{ width: "120px" }}
              type="primary"
              disabled={!jsonResponse && !editedValue}
              onClick={handleSubmitChanges}
            >
              Подтвердить
            </Button>
          </Flex>
        </Flex>
      ) : (
        <Flex
          style={{
            width: "100%",
            height: "85%",
            marginRight: 10,
          }}
        >
          <Flex vertical style={{ width: "97%", height: "100%" }} align="end">
            <DiffEditor
              original={jsonResponse}
              modified={editedValue}
              language="json"
              width="100%"
              className={styles.diffEditor}
              options={{
                readOnly: false,
                renderSideBySide: true,
              }}
            />
            <Flex gap={10}>
              <Button onClick={handleReturnToEdit}>Назад</Button>
              <Button
                type="primary"
                disabled={!editedValue}
                onClick={() => handleSendChanges(editedValue as string)}
              >
                Отправить
              </Button>
            </Flex>
          </Flex>
        </Flex>
      )}

      <Steps
        direction="vertical"
        style={{ width: "300px", height: "200px" }}
        size="small"
        current={configureStep}
        items={[
          {
            title: "Выбор конфигурации",
            description: "Выберите участок конфигурации для редактирования",
          },
          {
            title: "Редактирование",
            description: "Отредактируйте конфигурацию",
          },
          {
            title: "Проверка изменений",
            description: "Сравните изменения с исходной версии",
          },
          {
            title: "Отправка конфигурации",
            description: "Отправьте готовую конфигурацию на устройство",
          },
        ]}
      />
    </Flex>
  );
};
