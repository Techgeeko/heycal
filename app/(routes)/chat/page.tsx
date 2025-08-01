'use client'

import ChatComponent from './_component/page';
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { CalendarProvider } from "@/components/calendar-provider";

export default function Chat() {
  return (
    <div>
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />}>
        <div>
          <CalendarProvider>
            <ChatComponent />
          </CalendarProvider>
        </div>
      </Suspense>
    </div>
  );
}
