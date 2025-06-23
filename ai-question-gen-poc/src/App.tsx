import React, { useState, useEffect } from "react";
import Sidebar from "./components/sidebar";
import QuestionCard from "./components/questionCard";
import { getTextFromPDF } from "./utils/parsePDF";

interface Session {
  id: string;
  content: string;
  questions: string[];
}

const generateMockQuestions = (content: string): string[] => {
  return [
    "Q1 (2 marks): Summarize the main idea.",
    "Q2 (2 marks): Explain the key term mentioned.",
    "Q3 (2 marks): Describe the process.",
    "Q4 (2 marks): Give two examples.",
    "Q5 (2 marks): What are the implications?",
    "Q6-Q15 (1 mark each): Short factual or concept questions."
  ];
};

function App() {
  const [input, setInput] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("sessions");
    if (saved) setSessions(JSON.parse(saved));
  }, []);

  const saveSession = (session: Session) => {
    let updated = [session, ...sessions.slice(0, 4)];
    setSessions(updated);
    localStorage.setItem("sessions", JSON.stringify(updated));
  };

  const handleGenerate = () => {
    const questions = generateMockQuestions(input);
    const newSession = { id: Date.now().toString(), content: input, questions };
    saveSession(newSession);
    setCurrentSession(newSession);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await getTextFromPDF(file);
      setInput(text);
    }
  };

  const filteredSessions = sessions.filter(
    s => s.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
         s.questions.join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar sessions={filteredSessions} onSelect={setCurrentSession} onSearch={setSearchTerm} />
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">AI Question Paper Generator</h1>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste chapter text here..."
          className="w-full p-3 h-40 border border-gray-300 rounded mb-4"
        />
        <input type="file" accept="application/pdf" onChange={handleFileUpload} className="mb-4" />
        <button onClick={handleGenerate} className="bg-blue-600 text-white px-4 py-2 rounded">
          Generate Questions
        </button>

        {currentSession && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Generated Paper</h2>
            {currentSession.questions.map((q, i) => (
              <QuestionCard key={i} question={q} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
