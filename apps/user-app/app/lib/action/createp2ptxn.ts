"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";


export async function createP2PTransaction(amount: number, toUserNumber: string) {
    const session = await getServerSession(authOptions);
    const fromUserId = session?.user?.id;

    if (!fromUserId) {
        return { message: "User not logged in!!" };
    }

    const fromUser = await prisma.balance.findUnique({
        where: { userId: Number(fromUserId) }
    });

    const toUser = await prisma.user.findUnique({
        where: { number: toUserNumber }
    });

    if (!toUser) {
        return { message: "Recipient not found" };
    }

    try {
        const userAmount = fromUser?.amount || 0;
        if (userAmount >= amount) {
            await prisma.$transaction([
                prisma.balance.update({
                    where: { userId: Number(fromUserId) },
                    data: { amount: { decrement: amount } }
                }),
                prisma.balance.update({
                    where: { userId: Number(toUser.id) },
                    data: { amount: { increment: amount } }
                }),
                prisma.transactions.create({
                    data: {
                        userId: Number(fromUserId),
                        status: "Sent",
                        amount: amount,
                        startTime: new Date(),

                    }
                }),
                prisma.transactions.create({
                    data: {
                        userId: toUser.id,
                        status: "Recieved",
                        amount: amount,
                        startTime: new Date(),

                    }
                })
            ]);

            return { message: "Transaction successful" };
        } else {
            return { message: "Insufficient balance" };
        }
    } catch (e) {
        console.error(e);
        return { message: "Transaction failed" };
    }
}
