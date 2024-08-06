import React, { PropsWithChildren, useEffect, useState } from "react";
import styled from "styled-components";

import { useDependency } from "@wendellhu/redi/react-bindings";
import { STARTUP_TOKEN } from "../../core/services/startup.service";

const Loading = styled("div")`
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(#ee280e, #15a0f7, #6ed15a);
  animation: animate7712 1.2s linear infinite;

  ::after {
    content: "";
    position: absolute;
    width: 100px;
    height: 100px;
    /* top: 10px;
        left: 10px;
        right: 10px;
        bottom: 10px; */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #333;
    border: solid #333 5px;
    border-radius: 50%;
  }
  @keyframes animate7712 {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
  span {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(#ee280e, #15a0f7, #5ad15a);
  }
  span:nth-child(1) {
    filter: blur(5px);
  }

  span:nth-child(2) {
    filter: blur(10px);
  }

  span:nth-child(3) {
    filter: blur(25px);
  }

  span:nth-child(4) {
    filter: blur(50px);
  }
`;
const LoadingBox = styled("div")`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StartupLoading = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const [loading, setLoading] = useState(true);

  const startupService = useDependency(STARTUP_TOKEN);

  useEffect(() => {
    setLoading(true);
    startupService.load().subscribe(() => {
      setLoading(false);
    });
  }, []);

  if (!loading) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return (
    <LoadingBox>
      <Loading>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </Loading>
    </LoadingBox>
  );
};
