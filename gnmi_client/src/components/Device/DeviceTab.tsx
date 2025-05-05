import { Flex } from "antd";
import { DeviceInfo } from "./DeviceInfo.tsx";
import { InterfaceInfo } from "./InterfacesInfo.tsx";

export const DeviceTab = () => {
  return (
    <Flex justify="center">
      <Flex vertical style={{ maxWidth: "60%" }}>
        <DeviceInfo />
      </Flex>
      <InterfaceInfo />
    </Flex>
  );
};
