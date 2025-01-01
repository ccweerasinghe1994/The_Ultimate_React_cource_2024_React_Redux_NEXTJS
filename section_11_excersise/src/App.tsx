import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";

function App() {
  const [amount, setAmount] = useState<number>(0);
  const [convertedAmount, setConvertAmount] = useState<number>(0);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [loading, setLoading] = useState<boolean>(false);
  function handleAmountChange(e: ChangeEvent<HTMLInputElement>) {
    setAmount(Number(e.target.value));
  }
  function handleFromCurrencyChange(e: ChangeEvent<HTMLSelectElement>) {
    setFromCurrency(e.target.value);
  }

  function handleToCurrencyChange(e: ChangeEvent<HTMLSelectElement>) {
    setToCurrency(e.target.value);
  }

  useEffect(() => {
    async function convertCurrency() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
        );

        if (!response.ok) {
          setLoading(false);
          throw new Error("Something went wrong while fetching the data");
        }

        const data = await response.json();
        setConvertAmount(data.rates[toCurrency]);
        setLoading(false);
      } catch (error) {
        console.error("🚀 ~ convertCurrency ~ error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    }
    if (!amount || !fromCurrency || !toCurrency) {
      return;
    }

    if (fromCurrency === toCurrency) {
      setConvertAmount(amount);
      return;
    }

    convertCurrency();
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="flex flex-col gap-6 w-1/2 mx-auto mt-10">
      <label
        className="text-xl font-bold bg-slate-200 px-2 py-1"
        htmlFor="amount"
      >
        amount
      </label>
      <input
        disabled={loading}
        onChange={handleAmountChange}
        type="number"
        id="amount"
        name="amount"
        value={amount}
        className="border shadow px-2"
      />
      <label
        className="text-xl font-bold bg-slate-200 px-2 py-1"
        htmlFor="fromCurrency"
      >
        From Currency:
      </label>
      <select
        disabled={loading}
        name="fromCurrency"
        id="fromCurrency"
        value={fromCurrency}
        onChange={handleFromCurrencyChange}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="INR">INR</option>
        <option value="CAD">CAD</option>
      </select>
      <label
        className="text-xl font-bold bg-slate-200 px-2 py-1"
        htmlFor="toCurrency"
      >
        To Currency:
      </label>
      <select
        disabled={loading}
        name="toCurrency"
        id="toCurrency"
        value={toCurrency}
        onChange={handleToCurrencyChange}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="INR">INR</option>
        <option value="CAD">CAD</option>
      </select>
      <div className="text-xl font-bold bg-slate-200 px-2 py-1">
        Converted Amount:{loading ? "loading ..." : convertedAmount}
      </div>
    </div>
  );
}

export default App;
