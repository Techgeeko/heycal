"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink, Check, AlertCircle, RefreshCw, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useCalendar } from "@/components/calendar-provider";

const INTEGRATIONS = [
  {
    id: "google",
    name: "Google Calendar",
    description: "Link your Google Calendar.",
    icon: "/assets/icons/google-calendar.svg",
    active: true,
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    description: "Coming soon.",
    icon: "/assets/icons/microsoft-outlook.svg",
    active: false,
  },
  {
    id: "apple",
    name: "Apple Calendar",
    description: "Coming soon.",
    icon: "/assets/icons/apple-calendar.svg",
    active: false,
  }
];

export default function Component() {
  const {
    isConnected: googleConnected,
    connect,
    disconnect,
    loading: isConnecting
  } = useCalendar();

    const handleConnect = async () => {
    try {
      await connect();
      toast.success("✅ Google Calendar connected successfully.");
    } catch (err) {
      console.error("Connection error:", err);
      toast.error("❌ Failed to connect to Google Calendar.");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success("🛑 Google Calendar disconnected.");
    } catch (err) {
      console.error("Disconnection error:", err);
      toast.error("⚠️ Failed to disconnect from Google Calendar.");
    }
  };

  return (
    <>
      {/* === INTEGRATIONS === */}
      <Card>
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col space-y-1">
            <CardTitle className="text-black">Integrations</CardTitle>
            <p className="text-sm text-slate-600">
              Connect your calendar services to CalSync
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INTEGRATIONS.map((integration) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const isGoogle = integration.id === "google";

              return (
                <Card
                  key={integration.id}
                  className={`${!integration.active ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded flex items-center justify-center overflow-hidden">
                        <Image
                          src={integration.icon}
                          alt={`${integration.name} icon`}
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-base">{integration.name}</CardTitle>
                        <CardDescription className="text-sm">{integration.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  {integration.active && (
                    <CardContent className="pt-0 space-y-2">
                      <Button
                        className="w-full"
                        variant={googleConnected ? "outline" : "default"}
                        disabled={isConnecting}
                        onClick={googleConnected ? handleDisconnect : handleConnect}
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {googleConnected ? "Disconnecting..." : "Connecting..."}
                          </>
                        ) : (
                          <>
                            {googleConnected ? "Disconnect" : "Connect"}
                            {!googleConnected && <ExternalLink className="ml-2 h-4 w-4" />}
                          </>
                        )}
                      </Button>

                      {googleConnected && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          Connected
                        </Badge>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* === SYNC MANAGER === */}
      <Card className="mt-10 space-y-6">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col space-y-1">
            <CardTitle className="text-indigo-900">Sync Manager</CardTitle>
            <p className="text-sm text-slate-600">
              Monitor and manage calendar synchronization across platforms
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 py-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Google Calendar</CardTitle>
                <Badge className="bg-green-500">Synced</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">Last synced: 5 minutes ago</div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-sm">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>15 Events Synchronized</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                    <span>3 Calendars Connected</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Microsoft Outlook</CardTitle>
                <Badge className="bg-yellow-500">Syncing</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">Sync in progress...</div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-sm">
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin text-yellow-500" />
                    <span>Synchronizing 8 Events</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                    <span>2 Calendars Connected</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Apple Calendar</CardTitle>
                <Badge variant="destructive">Error</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">Authentication Required</div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center text-sm">
                    <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                    <span>Reconnection Needed</span>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">Reconnect</Button>
                </div>
              </CardContent>
            </Card>
          </div>        
        </CardContent>
      </Card>
    </>
  );
}