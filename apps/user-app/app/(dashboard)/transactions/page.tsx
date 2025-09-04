import React from 'react'
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import prisma from '@repo/db/client';
import { Transactions } from '../../../components/Transactions';

async function getTransactions() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const txns = await prisma.transactions.findMany({
        where: {
            userId: Number(userId)
        }
    });

    return txns.map(t => ({
        status: t.status,
        amount: t.amount,
        time: t.startTime
    }))
}

export default async function () {

    const transactions = await getTransactions();

    return (
        <div className="pt-4">
            <Transactions transactions={transactions} />
        </div>
    )
}
