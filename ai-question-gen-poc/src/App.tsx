import { useEffect, useState } from "react";
import { generateQuestionsFromAI } from "./utils/api";

interface QuestionSet {
  one: string[];
  two: string[];
}

function App() {
  const [input, setInput] = useState("");
  const [oneMark, setOneMark] = useState(10);
  const [twoMark, setTwoMark] = useState(5);
  const [questions, setQuestions] = useState<QuestionSet>({ one: [], two: [] });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<QuestionSet[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("question_history");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("question_history", JSON.stringify(history.slice(0, 5)));
  }, [history]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateQuestionsFromAI(input, oneMark, twoMark);
      const cleaned = result
        .map((line) => line.trim())
        .filter(
          (line) =>
            line &&
            !/^\d+\.\s*(1|2)-mark questions[:]?$/i.test(line) &&
            !/questions[:]?$/i.test(line)
        );
      const merged = mergeQuestionsAndAnswers(cleaned);
      const two = merged.slice(0, twoMark);
      const one = merged.slice(twoMark);
      const newSet = { one, two };
      setQuestions(newSet);
      setHistory((prev) => [newSet, ...prev.slice(0, 4)]);
      setActiveIndex(0);
    } catch (err) {
      alert("Failed to generate questions. Check API key or network.");
    } finally {
      setLoading(false);
    }
  };

  function mergeQuestionsAndAnswers(lines: string[]): string[] {
    const result: string[] = [];
    let i = 0;
    while (i < lines.length) {
      const current = cleanText(lines[i]);
      const next = lines[i + 1] && lines[i + 1].toLowerCase().startsWith("answer:")
        ? cleanText(lines[i + 1])
        : null;
      if (next) {
        result.push(`${current} (Answer: ${next})`);
        i += 2;
      } else {
        result.push(current);
        i += 1;
      }
    }
    return result;
  }

  function cleanText(text: string): string {
    return text.replace(/^\d+\.\s*/, "").replace(/^Answer:\s*/i, "").trim();
  }

  const displayed = activeIndex !== null ? history[activeIndex] : questions;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow p-4 border-r hidden md:block">
        <h2 className="text-lg font-semibold mb-4">Session History</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {history.map((_, idx) => (
            <li
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`cursor-pointer p-2 rounded hover:bg-gray-100 ${
                activeIndex === idx ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              Session {idx + 1}
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-center">AI Question Paper Generator</h1>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder="Paste your chapter content here..."
            className="w-full p-3 border border-gray-300 rounded shadow-sm resize-none"
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">1-mark Questions</label>
              <input
                type="number"
                value={oneMark}
                onChange={(e) => setOneMark(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">2-mark Questions</label>
              <input
                type="number"
                value={twoMark}
                onChange={(e) => setTwoMark(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full p-3 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Generating...
              </div>
            ) : (
              "Generate Questions"
            )}
          </button>

          {(displayed.two.length > 0 || displayed.one.length > 0) && (
            <div className="mt-6 space-y-6">
              {displayed.two.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-blue-700 mb-2">2-mark Questions:</h2>
                  <ul className="space-y-3">
                    {displayed.two.map((q, idx) => (
                      <li
                        key={idx}
                        className="p-3 bg-white shadow rounded border-l-4 border-blue-500"
                      >
                        <span className="font-medium">{idx + 1}.</span> {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {displayed.one.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-green-700 mb-2">1-mark Questions:</h2>
                  <ul className="space-y-3">
                    {displayed.one.map((q, idx) => (
                      <li
                        key={idx}
                        className="p-3 bg-white shadow rounded border-l-4 border-green-500"
                      >
                        <span className="font-medium">{idx + 1}.</span> {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
