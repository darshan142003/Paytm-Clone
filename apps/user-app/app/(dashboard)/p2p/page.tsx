"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import axios from "axios";
import { Select } from '@repo/ui/select';
import { createP2PTransaction } from '../../lib/action/createp2ptxn';
export default function () {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [options, setOptions] = useState<{ key: string; value: string }[]>([]);
    const [amount, setAmount] = useState(0);
    useEffect(() => {

        if (phoneNumber.length < 3) {
            setOptions([]);
            return;
        }

        const fetchNumbers = async () => {
            const res = await axios.get(`/api/search?q=${phoneNumber}`);
            setOptions(
                res.data.map((users: any) => ({
                    key: users.id.toString(),
                    value: users.number,
                }))
            )
        }

        fetchNumbers();
    }, [phoneNumber, setPhoneNumber])


    return (

        <div className="min-h-screen w-screen flex items-center justify-center">
            <div className="w-[350px] bg-white border border-gray-300 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Send</h2>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Number</label>
                        <input
                            type="text"
                            placeholder="Enter number"
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <div className='mt-4 '>
                            {options.length > 0 && (
                                <Select
                                    onSelect={(value) => setPhoneNumber(value)}
                                    options={options}
                                />
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1" >Amount</label>
                        <input
                            type="text"
                            placeholder="Enter the amount"
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>

                    <button className="mt-2 bg-gray-800 text-white rounded-md py-2 hover:bg-gray-900 transition" onClick={() => {
                        createP2PTransaction(amount * 100, phoneNumber)
                    }}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}
