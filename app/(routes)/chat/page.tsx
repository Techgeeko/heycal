import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Chat"
};

// Dynamically load ChatComponent only on the client
const ChatComponent = dynamic(() => import('./_component/page'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
});

export default function Chat() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <ChatComponent />
    </Suspense>
  );
}