import { useState, useCallback, useEffect, useRef } from "react";
import { useConversation } from "@elevenlabs/react";
import { Phone, PhoneOff, Mic, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { createPortal } from "react-dom";

interface VoiceCallAgentProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceCallAgent({ isOpen, onClose }: VoiceCallAgentProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const audioContextRef = useRef<AudioContext | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to agent");
      setIsConnecting(false);
    },
    onDisconnect: () => {
      console.log("Disconnected from agent");
      setCallDuration(0);
    },
    onMessage: (message) => {
      console.log("Message received:", message);
      const msg = message as unknown as Record<string, unknown>;
      
      if (msg.type === "agent_response") {
        const agentEvent = msg.agent_response_event as Record<string, unknown> | undefined;
        const content = agentEvent?.agent_response;
        if (content && typeof content === "string") {
          setTranscript(prev => [...prev.slice(-4), `🎓 ${content}`]);
        }
      } else if (msg.type === "user_transcript") {
        const userEvent = msg.user_transcription_event as Record<string, unknown> | undefined;
        const content = userEvent?.user_transcript;
        if (content && typeof content === "string") {
          setTranscript(prev => [...prev.slice(-4), `You: ${content}`]);
        }
      }
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect. Please try again.",
      });
      setIsConnecting(false);
    },
  });

  // Handle mounting state to avoid DOM conflicts
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    } else {
      const timer = setTimeout(() => setIsMounted(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (conversation.status === "connected") {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [conversation.status]);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startCall = useCallback(async () => {
    setIsConnecting(true);
    setTranscript([]);

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        } 
      });
      
      stream.getTracks().forEach(track => track.stop());

      const { data, error } = await supabase.functions.invoke("elevenlabs-conversation-token");

      if (error || !data?.signed_url) {
          console.log(data)
        throw new Error(error?.message || "Failed to get connection token");
      }

      console.log("Starting conversation with signed URL");

      await conversation.startSession({
        signedUrl: data.signed_url,
      });
      
    } catch (error) {
      console.error("Failed to start call:", error);
      toast({
        variant: "destructive",
        title: "Call Failed",
        description: error instanceof Error ? error.message : "Could not start the call. Please check microphone permissions.",
      });
      setIsConnecting(false);
    }
  }, [conversation, toast]);

  const endCall = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (e) {
      console.error("Error ending session:", e);
    }
    setCallDuration(0);
    setTranscript([]);
    onClose();
  }, [conversation, onClose]);

  if (!isMounted) return null;

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  const content = (
    <div 
      className={cn(
        "fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-200",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden border border-border">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 text-center">
          <div className="relative mx-auto w-24 h-24 mb-4">
            <div
              className={cn(
                "w-24 h-24 rounded-full bg-primary-foreground/20 flex items-center justify-center text-4xl transition-all duration-300",
                isSpeaking && "ring-4 ring-green-400 ring-opacity-75 animate-pulse"
              )}
            >
              🎓
            </div>
            {isSpeaking && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 animate-bounce">
                <Volume2 className="w-4 h-4 text-white" />
              </div>
            )}
            {isConnected && !isSpeaking && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5">
                <Mic className="w-4 h-4 text-white animate-pulse" />
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold">Aarambh Veda</h2>
          <p className="text-primary-foreground/80 text-sm">College Counselor</p>
          
          <div className="mt-3 flex items-center justify-center gap-2 text-sm">
            {isConnecting ? (
              <>
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                Connecting...
              </>
            ) : isConnected ? (
              <>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {isSpeaking ? "Speaking..." : "Listening..."} • {formatDuration(callDuration)}
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-gray-400 rounded-full" />
                Ready to call
              </>
            )}
          </div>
        </div>

        {/* Transcript area */}
        <div className="h-48 p-4 bg-muted/30 overflow-y-auto">
          {transcript.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm text-center px-4">
              {isConnected 
                ? "🎤 I'm listening! Start speaking..."
                : "📞 Tap the green call button to connect with our AI counselor"}
            </div>
          ) : (
            <div className="space-y-2">
              {transcript.map((line, i) => (
                <p
                  key={i}
                  className={cn(
                    "text-sm p-2 rounded-lg",
                    line.startsWith("You:") 
                      ? "bg-primary/10 text-foreground ml-8" 
                      : "bg-muted text-foreground mr-8"
                  )}
                >
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-6 flex items-center justify-center gap-4">
          {isConnected ? (
            <Button
              variant="destructive"
              size="icon"
              className="h-16 w-16 rounded-full shadow-lg"
              onClick={endCall}
            >
              <PhoneOff className="h-7 w-7" />
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="icon"
                className="h-14 w-14 rounded-full"
                onClick={onClose}
                disabled={isConnecting}
              >
                <PhoneOff className="h-6 w-6" />
              </Button>

              <Button
                size="icon"
                className="h-16 w-16 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
                onClick={startCall}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Phone className="h-7 w-7" />
                )}
              </Button>
            </>
          )}
        </div>

        <div className="px-6 pb-4 text-center text-xs text-muted-foreground">
          {isConnected 
            ? "🗣️ Speak naturally - I can hear you!"
            : "Free consultation • No signup required"
          }
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
