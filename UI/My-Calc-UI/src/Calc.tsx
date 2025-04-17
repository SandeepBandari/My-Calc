import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Calc.css";

interface CalculationHistory {
  expression: string;
  result: string;
  timestamp: string;
}

interface ApiResponse {
  result?: number;
  message?: string;
  error?: string;
}

type OperationName = 'add' | 'sub' | 'mul' | 'div' | 'modulus';
type ButtonValue = string | number;
type Operator = '+' | '-' | '*' | '/' | '%';

const Calculator = () => {
  const [currentInput, setCurrentInput] = useState<string>("0");
  const [storedValue, setStoredValue] = useState<string>("");
  const [currentOperator, setCurrentOperator] = useState<Operator | "">("");
  const [displayValue, setDisplayValue] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const [sessionHistory, setSessionHistory] = useState<CalculationHistory[]>([]);

  useEffect(() => {
    // Load history from session storage
    const history = JSON.parse(sessionStorage.getItem('sessionHistory') || '[]') as CalculationHistory[];
    setSessionHistory(history);
  }, []);

  const calculateWithAPI = async (
    operationName: OperationName,
    value1: string,
    value2: string
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch(
        `http://localhost:8080/calc/${operationName}?value1=${value1}&value2=${value2}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem('token')}`
          },
        }
      );

      if (!response.ok) {
        const errorData: ApiResponse = await response.json();
        throw new Error(errorData.message || "API request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      if (error instanceof Error) {
        setError(error.message);
      }
      throw error;
    }
  };

  const handleButtonClick = async (value: ButtonValue): Promise<void> => {
    setError("");

    if (value === "C") {
      resetCalculator();
      return;
    }

    if (value === "DEL") {
      handleDelete();
      return;
    }

    if (value === "=") {
      await handleCalculate();
      return;
    }

    if (["+", "-", "*", "/", "%"].includes(value.toString())) {
      await handleOperator(value as Operator);
      return;
    }

    handleNumberInput(value.toString());
  };

  const resetCalculator = (): void => {
    setCurrentInput("0");
    setStoredValue("");
    setCurrentOperator("");
    setDisplayValue("0");
  };

  const handleDelete = (): void => {
    if (currentInput.length > 1) {
      const newInput = currentInput.slice(0, -1);
      setCurrentInput(newInput);
      setDisplayValue(storedValue + currentOperator + newInput);
    } else {
      setCurrentInput("0");
      setDisplayValue(storedValue + currentOperator + "0");
    }
  };

  const handleCalculate = async (): Promise<void> => {
    if (!storedValue || !currentOperator) return;

    setIsLoading(true);
    try {
      const { result } = await calculateWithAPI(
        getOperationName(currentOperator),
        storedValue,
        currentInput
      );

      if (result === undefined) {
        throw new Error("Invalid response from server");
      }

      addToSessionHistory(`${storedValue} ${currentOperator} ${currentInput}`, result.toString());

      setDisplayValue(result.toString());
      setCurrentInput(result.toString());
      setStoredValue("");
      setCurrentOperator("");
    } catch (error) {
      if (error instanceof Error) {
        setDisplayValue("Error: " + error.message);
      } else {
        setDisplayValue("Error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOperator = async (operator: Operator): Promise<void> => {
    if (currentOperator) {
      setIsLoading(true);
      try {
        const { result } = await calculateWithAPI(
          getOperationName(currentOperator),
          storedValue,
          currentInput
        );

        if (result === undefined) {
          throw new Error("Invalid response from server");
        }

        setStoredValue(result.toString());
        setCurrentOperator(operator);
        setCurrentInput("0");
        setDisplayValue(`${result}${operator}`);
      } catch (error) {
        if (error instanceof Error) {
          setDisplayValue("Error: " + error.message);
        } else {
          setDisplayValue("Error");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setStoredValue(currentInput);
      setCurrentOperator(operator);
      setCurrentInput("0");
      setDisplayValue(`${currentInput}${operator}`);
    }
  };

  const handleNumberInput = (value: string): void => {
    if (currentInput === "0" || displayValue.includes("=")) {
      setCurrentInput(value);
      setDisplayValue(storedValue + currentOperator + value);
    } else {
      setCurrentInput(prev => prev + value);
      setDisplayValue(storedValue + currentOperator + currentInput + value);
    }
  };

  const getOperationName = (operator: Operator): OperationName => {
    const operations: Record<Operator, OperationName> = {
      '+': 'add',
      '-': 'sub',
      '*': 'mul',
      '/': 'div',
      '%': 'modulus'
    };
    return operations[operator];
  };

  const addToSessionHistory = (expression: string, result: string): void => {
    const historyEntry: CalculationHistory = {
      expression,
      result,
      timestamp: new Date().toLocaleString(),
    };

    const updatedHistory = [...sessionHistory, historyEntry];
    setSessionHistory(updatedHistory);
    sessionStorage.setItem('sessionHistory', JSON.stringify(updatedHistory));
  };

  const showHistory = (): void => {
    if (sessionHistory.length === 0) {
      setDisplayValue("Session history is empty.");
      return;
    }

    const historyText = sessionHistory
      .map((entry, index) => `${index + 1}. ${entry.expression} = ${entry.result}`)
      .join("\n");

    setDisplayValue(historyText);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Calculator</h1>
      </header>

      <div className="calc">
        <div className="display">
          {isLoading ? "Loading..." : error || displayValue}
        </div>
        <div className="buttons">
          <button className="clear" onClick={() => handleButtonClick("C")}>C</button>
          <button className="dele" onClick={() => handleButtonClick("DEL")}>DEL</button>
          <button className="divs" onClick={() => handleButtonClick("/")}>/</button>
          <button className="mult" onClick={() => handleButtonClick("*")}>*</button>

          <button onClick={() => handleButtonClick("7")}>7</button>
          <button onClick={() => handleButtonClick("8")}>8</button>
          <button onClick={() => handleButtonClick("9")}>9</button>
          <button className="minu" onClick={() => handleButtonClick("-")}>-</button>

          <button onClick={() => handleButtonClick("4")}>4</button>
          <button onClick={() => handleButtonClick("5")}>5</button>
          <button onClick={() => handleButtonClick("6")}>6</button>
          <button className="addi" onClick={() => handleButtonClick("+")}>+</button>

          <button onClick={() => handleButtonClick("1")}>1</button>
          <button onClick={() => handleButtonClick("2")}>2</button>
          <button onClick={() => handleButtonClick("3")}>3</button>
          <button className="modu" onClick={() => handleButtonClick("%")}>%</button>

          <button className="dot" onClick={() => handleButtonClick(".")}>.</button>
          <button onClick={() => handleButtonClick("0")}>0</button>
          <button className="equals" onClick={() => handleButtonClick("=")}>=</button>
          <button className="history" onClick={showHistory}>History</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;