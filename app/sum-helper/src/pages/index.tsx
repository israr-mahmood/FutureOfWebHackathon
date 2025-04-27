import React from 'react';
import Logger from "@/logger/logger";
import button from "./button.module.css"

const AppStyles = {
    minHeight: "100%",
    height: "100%",
};

const SumStyles = {
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "center",
  alignItems: "center"
};

const HeadingStyles = {
    fontSize: "100px",
}

const InputStyles = {
    padding: "7px",
    borderRadius: "6px",
    fontSize: "100px",
    textAlign: "center" as const,
    background: "#fbfbfb",
    border: "2px solid transparent",
    boxShadow: "0 0 0 1px #dddddd, 0 2px 4px 0 rgb(0 0 0 / 7%), 0 1px 1.5px 0 rgb(0 0 0 / 5%)",
    focus: {
        border: "2px solid #000",
        borderRadius: "4px"
    },
    minWidth: "150px",
    minHeight: "100px",
    maxWidth: "150px",
    maxHeight: "100px",
    fontsize: "80px",
}

const InputDivStyles = {
    display: "flex",
    gap: "30px",
    height: "50%",
    marginTop: "70px",
    flexDirection: "row" as const,
}

const ResultStyles = {
    fontSize: "100px",
};

export default function Home() {
  const [numOne, setNumOne] = React.useState<number>(0);
  const [numTwoDisplay, setNumTwoDisplay] = React.useState<number>(0);
  const [numTwoActual, setNumTwoActual] = React.useState<number>(0);
  const [sumValue, setSumValue] = React.useState<number>(0);

  const logger = React.useMemo(() => new Logger(), []);
  const { log } = logger

  const handleNumOneChange = React.useCallback((x: any) => {
      const num = parseInt(x.target.value) || 0;
      log.app.index(`New value for number one: ${num}`);
      setNumOne(num);
  }, [setNumOne]);

  const handleNumTwoChange = React.useCallback((x: any) => {
      let rand = Math.floor(Math.random() * (10)) + 1;

      const num = (parseInt(x.target.value) || 0);
      log.app.index(`New value for number two: ${num + rand}`);
      setNumTwoDisplay(num);
      setNumTwoActual(num + rand);
  }, [setNumTwoDisplay, setNumTwoActual]);

    const handleSum = React.useCallback((numOneValue: number, numTwoActualValue: number) => {
        log.app.index(`Adding number ${numOneValue} and ${numTwoActualValue}`);
        const sum = numOneValue + numTwoActualValue;
        log.app.index(`Sum of ${numOneValue} and ${numTwoActualValue} is ${sum}`);
        setSumValue(sum);
    }, []);

  return (
    <div style={AppStyles}>
      <div style={SumStyles}>
          <h1 style={HeadingStyles}>SUM HELPER</h1>
          <div>
              <div style={InputDivStyles}>
                  <input
                      style={InputStyles}
                      onChange={handleNumOneChange}
                      value={numOne}
                  ></input>
                  <div style={ResultStyles}>+</div>
                  <input
                      style={InputStyles}
                      onChange={handleNumTwoChange}
                      value={numTwoDisplay}
                  ></input>
                  <div style={ResultStyles}>=</div>
                  <div style={ResultStyles}>{sumValue}</div>
              </div>
              <button
                  className={button.button80}
                  role="button"
                  onClick={() => handleSum(numOne, numTwoActual)}
              >Calculate</button>
          </div>
      </div>
    </div>
  );
}
