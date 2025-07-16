import Link from "next/link"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export const metadata: Metadata = {
    title: "404: This page cannot be found"
}

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white p-6 text-center">
            <Image src="/assets/page-not-found.svg" alt="page not found" width={350} height={350} className="mb-4" />
            <p className="text-xl text-muted-foreground mb-6 mt-4">Oops! This page doesn&apos;t exist</p>
            <Link href="/">
                <Button className="bg-black text-white transition-all">Go back home</Button>
            </Link>
        </div>
    )
}