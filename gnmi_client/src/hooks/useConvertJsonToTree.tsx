import { useEffect, useState } from "react";
import { TreeDataNode } from "antd";
/* eslint-disable */

export const useConvertJsonToTree = (
  data: object | null | undefined,
  configureStepCallback: (step: number) => void,
  setEditedValueCallback: (value: string) => void,
) => {
  const [tree, setTree] = useState<TreeDataNode[]>([]);
  const [jsonResponse, setJsonResponse] = useState<string | undefined>(
    undefined,
  );

  const handleTreeToJson = (data: object) => {
    const jsonResponse = JSON.stringify(data, null, 4);
    setJsonResponse(jsonResponse);
    setEditedValueCallback(jsonResponse);
    configureStepCallback(1);
  };

  function converter(obj: any, parentKey = ""): TreeDataNode[] {
    return Object.entries(obj).flatMap(([key, value]): TreeDataNode[] => {
      const nodeKey = parentKey ? `${parentKey}/${key}` : key;

      if (Array.isArray(value)) {
        const objectItems = value.filter(
          (item) => typeof item === "object" && item !== null,
        );

        if (objectItems.length === 0) {
          return [];
        }

        return [
          {
            title: (
              <span
                onClick={() => {
                  console.log(nodeKey);
                  handleTreeToJson(objectItems);
                }}
              >
                {key}
              </span>
            ),
            key: nodeKey,
            children: objectItems.map(
              (item, index): TreeDataNode => ({
                title: (
                  <span
                    onClick={() => {
                      console.log(nodeKey);
                      handleTreeToJson(objectItems[index]);
                    }}
                  >
                    {String(index)}
                  </span>
                ),
                key: `${nodeKey}[${index}]`,
                children: converter(item, `${nodeKey}[${index}]`),
              }),
            ),
          },
        ];
      }

      if (typeof value === "object" && value !== null) {
        return [
          {
            title: <span onClick={() => handleTreeToJson(value)}>{key}</span>,
            key: nodeKey,
            children: converter(value, nodeKey),
          },
        ];
      }

      return [
        {
          title: key,
          key: nodeKey,
          isLeaf: true,
        },
      ];
    });
  }

  useEffect(() => {
    if (data) {
      const result = converter(data);
      setTree(result);
    }
  }, [data]);

  return { tree, jsonResponse, setJsonResponse };
};
