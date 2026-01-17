import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#253745] hover:bg-[#4A5C6A] text-[#CCD0CF] p-4 rounded-full shadow-lg transition"
        >
          <MessageCircle size={22} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-[#11212D] rounded-xl shadow-xl flex flex-col overflow-hidden border border-[#253745]">
          
          <div className="bg-[#253745] text-[#CCD0CF] px-4 py-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold">
              LAKSHYA Assistant
            </h4>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 px-4 py-3 text-sm text-[#9BA8AB]">
            <div className="bg-[#06141B] p-3 rounded-lg">
              Hi 👋 I’m your <strong>LAKSHYA Assistant</strong>  
              <br />
              Ask me about careers, skills, courses, or internships.
            </div>
          </div>

          <div className="border-t border-[#253745] px-3 py-2">
            <input
              disabled
              placeholder="Type your question..."
              className="w-full text-sm px-3 py-2 bg-[#06141B] border border-[#253745] rounded-lg text-[#CCD0CF]"
            />
          </div>
        </div>
      )}
    </>
  );
}
