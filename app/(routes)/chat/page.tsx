'use client'

// import { Metadata } from 'next'
import ChatComponent from './_component/page';
import { useCalendar } from "@/components/calendar-provider";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

// export const metadata : Metadata = {
//   title: "Chat"
// }

export default function Chat() {
  const { loading } = useCalendar();

  useEffect(() => {
    document.title = "Chat";
  }, []);

  return (
    <div>
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