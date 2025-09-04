"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";
export async function createOnRampTransaction(amount: number, provider: string) {

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const token = Math.random().toString();
    if (!userId) {
        return {
            messgae: "user not signed in!!"
        }
    }


    await prisma.onRampTransaction.create({
        data: {
            userId: Number(userId),
            startTime: new Date(),
            status: "Processing",
            amount: amount,
            token: token,
            provider
        }
    })

    return {
        message: "on ramp transaction added"
    }

}