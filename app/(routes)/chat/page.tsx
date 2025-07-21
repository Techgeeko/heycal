import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ChatComponent from './_component/page';

export const metadata: Metadata = {
  title: "Chat"
};

export default function Chat() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ChatComponent />
    </Suspense>
  );
}
