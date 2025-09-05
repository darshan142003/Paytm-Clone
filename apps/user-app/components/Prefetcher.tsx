"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function Prefetcher({ routes }: { routes: string[] }) {

    const router = useRouter();

    useEffect(() => {
        routes.forEach((route) => router.prefetch(route))
    }, [router, routes])

    return null;
}