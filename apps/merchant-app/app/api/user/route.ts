import { NextResponse } from "next/server"
import prisma from "@repo/db/client"
import { randomUUID } from "crypto"


export const GET = async () => {
    await prisma.merchant.create({
        data: {
            email: randomUUID(),
            name: "adsads",
            auth_type: "Google"
        }
    })
    return NextResponse.json({
        message: "hi there"
    })
}