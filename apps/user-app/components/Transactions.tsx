import { Card } from "@repo/ui/card"
import { randomUUID } from "crypto"

export const Transactions = ({
    transactions
}: {
    transactions: {
        status: string,
        amount: number,
        time: Date

    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2 space-y-3">
            {transactions.map(t => <div key={randomUUID()} className="flex justify-between">
                <div>
                    <div className="text-sm">
                        {t.status} INR
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    {t.status == 'Sent' ? "-" : "+"}  Rs {t.amount / 100}
                </div>

            </div>)}
        </div>
    </Card>
}