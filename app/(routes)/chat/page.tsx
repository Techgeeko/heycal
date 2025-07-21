// app/chat/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ChatComponent from './_component/page';

export const metadata: Metadata = {
  title: "Chat"
};

export default function Chat() {
  return (
    <div className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center overflow-hidden">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <div>
          <ChatComponent />
        </div>
      </Suspense>
    </div>
  );
}
