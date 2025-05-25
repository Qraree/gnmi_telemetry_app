import { useXTerm } from "react-xtermjs";
import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import { useParams } from "react-router";

export const TerminalTab = () => {
  const { device } = useParams();
  const { instance, ref } = useXTerm();
  const [command, setCommand] = useState<string>("");
  const commandRef = useRef(command);

  const [socketUrl, setSocketUrl] = useState<string>();

  // const { data } = useQuery({
  //   queryKey: ["create_session"],
  //   queryFn: () => createDeviceSshSession(Number(device)),
  // });
  //
  // useEffect(() => {
  //   setSocketUrl(
  //     `${import.meta.env.VITE_WEBSOCKET_URL}/${data?.data?.session_id}`,
  //   );
  // }, [data, device]);

  const { sendMessage } = useWebSocket(
    socketUrl ?? "",
    {
      onOpen: () => console.log("opened"),
      onMessage: (message) => instance?.write(message.data),
      shouldReconnect: (closeEvent) => closeEvent.code !== 1000,
    },
    false,
  );

  useEffect(() => {
    commandRef.current = command;
  }, [command]);

  useEffect(() => {
    if (!instance) return;

    const dataHandler = (data: string) => {
      console.log(data);
      sendMessage(data);
    };

    instance.onData(dataHandler);
  }, [instance]);

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
};
