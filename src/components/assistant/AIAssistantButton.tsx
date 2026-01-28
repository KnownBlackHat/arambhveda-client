import { useState } from "react";
import { Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceCallAgent } from "./VoiceCallAgent";

export function AIAssistantButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-green-600 hover:bg-green-700 group"
        size="icon"
      >
        <Headphones className="h-6 w-6 group-hover:scale-110 transition-transform" />
      </Button>

      {/* Tooltip */}
      <div className="fixed bottom-6 right-24 z-50 bg-card border border-border rounded-lg px-3 py-2 shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-sm font-medium whitespace-nowrap">Talk to AI Counselor</p>
      </div>

      {/* Voice Call Portal */}
      <VoiceCallAgent isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
