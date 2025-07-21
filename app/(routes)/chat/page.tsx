"use client";

import ChatComponent from './_component/page';
import { useCalendar } from "@/components/calendar-provider";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function Chat() {
  const { loading } = useCalendar();

  useEffect(() => {
    document.title = "Chat";
  }, []);

  return (
    <div className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div>
          <ChatComponent />
        </div>
      )}
    </div>
  );
}