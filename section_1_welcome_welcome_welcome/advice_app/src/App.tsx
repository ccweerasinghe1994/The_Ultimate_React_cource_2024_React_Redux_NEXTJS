import { useState, useEffect, FC } from "react";

function App() {
  const [advice, setAdvice] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function getAdvice() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://api.adviceslip.com/advice");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch advice");
      }
      setAdvice(data.slip.advice);
      setCount((c) => c + 1);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAdvice();
  }, []);

  return (
    <div className="max-w-md flex flex-col gap-5 items-center mx-auto text-xl mt-10">
      <Message advice={advice} error={error} />
      <button
        className="border border-blue-400 font-semibold px-2 py-1 bg-blue-400 rounded-sm disabled:opacity-50"
        onClick={getAdvice}
        disabled={loading}
      >
        {loading ? "Loading..." : "Get advice"}
      </button>
      <p>
        You have read <strong>{count}</strong> pieces of advice
      </p>
    </div>
  );
}

type MessageProps = {
  advice: string;
  error: string;
};

const Message: FC<MessageProps> = ({ advice, error }) => {
  return error ? <p className="text-red-500">{error}</p> : <h1>{advice}</h1>;
};

export default App;
