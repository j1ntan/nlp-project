import { useState, useEffect, useCallback, useMemo } from "react";
import { generateQuestionsFromAI } from "./utils/api";
import "./index.css";

interface Session {
  id: string;
  title: string;
  content: string;
  questions: string[];
}

function App() {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [oneMark, setOneMark] = useState(10);
  const [twoMark, setTwoMark] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sessions");
      if (saved) {
        setSessions(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  }, []);

  // Save sessions
  const saveSession = useCallback((session: Session) => {
    try {
      const updated = [session, ...sessions.slice(0, 4)];
      setSessions(updated);
      localStorage.setItem("sessions", JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving session:", error);
    }
  }, [sessions]);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    try {
      const result = await generateQuestionsFromAI(input, oneMark, twoMark);
      const newSession: Session = {
        id: Date.now().toString(),
        title: input.slice(0, 20) + "...",
        content: input,
        questions: result,
      };

      setCurrentSession(newSession);
      setQuestions(result);
      saveSession(newSession);
    } catch (error) {
      console.error("Error generating questions:", error);
      // You might want to add error handling UI here
    }
  };

  const handleSessionClick = useCallback((session: Session) => {
    setCurrentSession(session);
    setQuestions(session.questions);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredSessions = useMemo(() => 
    sessions.filter(
      (s) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.content.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [sessions, searchTerm]
  );

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4 border-r overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">Previous Sessions</h2>
        <input
          type="text"
          placeholder="Search sessions..."
          className="w-full mb-4 p-2 border rounded"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <ul>
          {filteredSessions.map((s) => (
            <li
              key={s.id}
              onClick={() => handleSessionClick(s)}
              className="cursor-pointer mb-2 p-2 bg-white rounded shadow hover:bg-blue-100"
            >
              {s.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">AI Question Generator</h1>

        <textarea
          className="w-full h-40 p-3 border rounded mb-4"
          placeholder="Paste your chapter or content here..."
          value={input}
          onChange={handleInputChange}
        />

        <div className="flex gap-4 mb-4">
          <div>
            <label className="block mb-1">1-mark Questions</label>
            <input
              type="number"
              min="0"
              value={oneMark}
              onChange={(e) => setOneMark(Math.max(0, parseInt(e.target.value) || 0))}
              className="border p-2 rounded w-24"
            />
          </div>
          <div>
            <label className="block mb-1">2-mark Questions</label>
            <input
              type="number"
              min="0"
              value={twoMark}
              onChange={(e) => setTwoMark(Math.max(0, parseInt(e.target.value) || 0))}
              className="border p-2 rounded w-24"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!input.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Generate Questions
        </button>

        {questions.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Generated Questions:</h2>
            <ul className="space-y-3">
              {questions.map((q, i) => (
                <li
                  key={i}
                  className="p-3 bg-white rounded shadow border-l-4 border-blue-600"
                >
                  {q}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
