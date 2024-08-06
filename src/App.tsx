import { useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import "./App.css";
import { environment } from "./environments/environment";
import { computed, signal } from "@preact/signals-react";
const GlobalStyled = createGlobalStyle`

  body {
    margin: 0;
    color: #fff;
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    background-image: linear-gradient(to bottom, #020917, #101725);
  }

  .content {
    display: flex;
    min-height: 100vh;
    line-height: 1.1;
    text-align: center;
    flex-direction: column;
    justify-content: center;
  }

  .content h1 {
    font-size: 3.6rem;
    font-weight: 700;
  }

  .content p {
    font-size: 1.2rem;
    font-weight: 400;
    opacity: 0.5;
  }
`;

const test = signal(0);

const App = () => {
  const test1 = computed(() => test.value * 2);
  return (
    <>
      <GlobalStyled />
      <div className="content" onClick={() => test.value++}>
        <p> {test.value}</p>
        <p>{test1.value}</p>
        <h1>Rsbuild with React</h1>
        <p>Start building amazing things with Rsbuild.</p>
      </div>
    </>
  );
};

export default App;
