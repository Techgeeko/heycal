"use client";

import type { Metadata } from "next";
import ChatComponent from './_component/page';
import { useCalendar } from "@/components/calendar-provider";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function Chat() {
  const { loading } = useCalendar();

  // Set page title dynamically since we can't use metadata in client components
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