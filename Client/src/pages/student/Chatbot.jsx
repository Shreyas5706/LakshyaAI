import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi 👋 I’m your AI Career Assistant. Ask me about careers, skills, roadmaps, or learning plans.",
    },
  ]);

  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    /* ===================================================
       🔥 BACKEND INTEGRATION POINT (IMPORTANT)
       
       👉 Your backend friend should:
       - Create API: POST /api/chat
       - Connect Google Gemini / OpenAI / Claude
       - Send user's message
       - Return AI response as { reply: "text" }
       
       Example response format:
       {
         reply: "Here is your personalized career roadmap..."
       }
    ==================================================== */

    // ❌ REMOVE THIS MOCK WHEN BACKEND IS READY
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "🤖 (Mock AI Response)\nYour AI backend will generate real answers here using Gemini API.",
        },
      ]);
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex justify-center items-center bg-[#F6FBFA] p-6">
      <div className="chat-container">

        {/* ================= HEADER ================= */}
        <div className="chat-header">
          <div className="bot-icon">
            <Bot size={24} />
          </div>
          <div>
            <h2>AI Career Chatbot</h2>
            <p>Ask anything about your career & learning path</p>
          </div>
        </div>

        {/* ================= MESSAGES ================= */}
        <div className="chat-body">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.role === "user" ? "user" : "bot"}`}
            >
              <div className="avatar">
                {msg.role === "user" ? (
                  <User size={16} />
                ) : (
                  <Bot size={16} />
                )}
              </div>

              <div className="bubble">{msg.content}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* ================= INPUT ================= */}
        <div className="chat-input">
          <input
            placeholder="Ask about careers, skills, roadmap..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* ================= CSS ================= */}
      <style>{css}</style>
    </div>
  );
}

/* ================= CSS ================= */

const css = `
.chat-container{
  width: 100%;
  max-width: 900px;
  height: 82vh;

  display: flex;
  flex-direction: column;

  background: rgba(255,255,255,0.78);
  backdrop-filter: blur(18px);
  border-radius: 28px;
  border: 1px solid rgba(20,184,166,0.25);

  box-shadow:
    0 30px 80px rgba(14,147,132,0.25),
    inset 0 1px 0 rgba(255,255,255,0.6);
}

/* HEADER */
.chat-header{
  display: flex;
  align-items: center;
  gap: 14px;

  padding: 20px 24px;
  border-bottom: 1px solid rgba(20,184,166,0.25);
}

.chat-header h2{
  font-size: 1.25rem;
  font-weight: 700;
  color: #064E3B;
}

.chat-header p{
  font-size: .85rem;
  color: #64748B;
}

.bot-icon{
  width: 44px;
  height: 44px;
  border-radius: 12px;

  background: linear-gradient(135deg,#0E9384,#14B8A6);
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* BODY */
.chat-body{
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* MESSAGE */
.message{
  display: flex;
  gap: 10px;
  max-width: 75%;
}

.message.user{
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message.bot{
  align-self: flex-start;
}

.avatar{
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ECFEFF;
  color: #0E9384;

  display: flex;
  align-items: center;
  justify-content: center;
}

.bubble{
  padding: 14px 18px;
  border-radius: 18px;
  font-size: .9rem;
  line-height: 1.5;
}

.message.user .bubble{
  background: linear-gradient(135deg,#0E9384,#14B8A6);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.bot .bubble{
  background: #F6FBFA;
  border: 1px solid #99F6E4;
  color: #064E3B;
  border-bottom-left-radius: 4px;
}

/* INPUT */
.chat-input{
  display: flex;
  gap: 12px;
  padding: 18px;
  border-top: 1px solid rgba(20,184,166,0.25);
}

.chat-input input{
  flex: 1;
  height: 48px;
  padding: 0 18px;
  border-radius: 14px;
  border: 1px solid #99F6E4;
  background: #F6FBFA;
}

.chat-input input:focus{
  outline: none;
  border-color: #14B8A6;
  box-shadow: 0 0 0 3px rgba(20,184,166,.25);
}

.chat-input button{
  width: 48px;
  height: 48px;
  border-radius: 14px;
  border: none;
  cursor: pointer;

  background: linear-gradient(135deg,#0E9384,#14B8A6);
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;
}
`;
