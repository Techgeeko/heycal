import type { Metadata } from "next";
import ChatComponent from './_component/page'

export const metadata: Metadata = {
    title: "Chat"
}

export default function Chat() {
    return (
        <ChatComponent />
    );
}