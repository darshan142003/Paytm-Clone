import React from 'react'
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import prisma from '@repo/db/client';
import { Transactions } from '../../../components/Transactions';

// Define a type for a transaction
type TransactionType = {
    status: string
    amount: number
    time: Date
}

async function getTransactions(): Promise<TransactionType[]> {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) return [];

    // Use Prisma's generated types
    const txns = await prisma.transactions.findMany({
        where: { userId: Number(userId) }
    });

    // Explicitly cast 't' to Prisma type
    return txns.map((t: typeof txns[number]): TransactionType => ({
        status: t.status,
        amount: t.amount,
        time: t.startTime
    }));
}

export default async function TransactionsPage() {
    const transactions = await getTransactions();

    return (
        <div className="pt-4">
            <Transactions transactions={transactions} />
        </div>
    )
}
