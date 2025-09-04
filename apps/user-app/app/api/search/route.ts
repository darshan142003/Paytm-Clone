import prisma from "@repo/db/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    console.log(session.user);
    const myNumber = session?.user?.number;
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query) {
        return NextResponse.json([]);
    }

    const users = await prisma.user.findMany({
        where: {
            number: {
                startsWith: query,
            },
            NOT: {
                number: myNumber || "",
            },
        },
        take: 6,
    });

    return NextResponse.json(users);
}
