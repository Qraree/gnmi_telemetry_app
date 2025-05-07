import { Flex, Select } from "antd";
import { openconfigModules } from "../../../utils/openconfig-modules.ts";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDeviceYang } from "../../../api/devices_api.ts";
import { useParams } from "react-router";

export const YangTab = () => {
  const { device } = useParams();
  const [yangQuery, setYangQuery] = useState<string>(openconfigModules[0]);

  const { data, refetch } = useQuery({
    queryKey: ["yang", yangQuery],
    queryFn: () => getDeviceYang(Number(device), [yangQuery]),
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const handleChange = (value: string) => {
    setYangQuery(() => value);
  };

  useEffect(() => {
    console.log(data);
    refetch();
  }, [yangQuery]);

  return (
    <Flex>
      <Flex vertical>
        <Select
          defaultValue={openconfigModules[0]}
          style={{ width: 400 }}
          onChange={handleChange}
          options={openconfigModules.map((item) => ({
            value: item,
            label: item,
          }))}
        />
      </Flex>
    </Flex>
  );
};
