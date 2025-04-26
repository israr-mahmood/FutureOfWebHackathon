import React from 'react';
import Logger from "@/logger/logger";

const AppStyles = {
    minHeight: "100%",
    height: "100%",
    padding: "50px",
    background: "#3a3838",
};

const SumStyles = {
  display: "flex",
  flexDirection: "column" as "column",
  justifyContent: "center",
  alignItems: "center"
};

const HeadingStyles = {
    color: "white",
}

const InputStyles = {
    padding: "7px",
    borderRadius: "6px",
    // fontSize: "16px",
    background: "#fbfbfb",
    border: "2px solid transparent",
    // height: "36px",
    boxShadow: "0 0 0 1px #dddddd, 0 2px 4px 0 rgb(0 0 0 / 7%), 0 1px 1.5px 0 rgb(0 0 0 / 5%)",
    focus: {
        border: "2px solid #000",
        borderRadius: "4px"
    },
    minWidth: "100px",
    minHeight: "100px",
    maxWidth: "100px",
    maxHeight: "100px",
    fontsize: "80px",
}

const InputDivStyles = {
    display: "flex",
    flexDirection: "row" as "row",
    gap: "10px",
}

export default function Home() {
  const [numOne, setNumOne] = React.useState<number>(0);
  const [numTwo, setNumTwo] = React.useState<number>(0);
  const [sumValue, setSumValue] = React.useState<number>(0);

  const logger = React.useMemo(() => new Logger(), []);
  const { log } = logger

  const handleSum = () => {
      log.app.index('message');
      setSumValue(numOne + numTwo);
  };

  return (
    <div style={AppStyles}>
      <div style={SumStyles}>
          <h1 style={HeadingStyles}>SUM HELPER</h1>
          <div>
              <div style={InputDivStyles}>
                  <input
                      style={InputStyles}
                      onChange={(x) => setNumOne(parseInt(x.target.value) || 0)}
                      value={numOne}
                  ></input>
                  <img src="./plus.png" alt="My Image"/>
                  <input
                      style={InputStyles}
                      onChange={(x) => setNumTwo(parseInt(x.target.value) || 0)}
                      value={numTwo}
                  ></input>
                  <p>{sumValue}</p>
              </div>
              <button onClick={() => handleSum()}>Calculate</button>
          </div>
      </div>
    </div>
  );
}
