"use client";
import React, { useState } from 'react';
import { Button, Input } from "@nextui-org/react";
import axios from 'axios';

export default function GenerateAccessKey() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [accessKey, setAccessKey] = useState('');

    const generateAccessKey = async (email: string): Promise<void> => {
        try {
            if (!email) {
                setError('Please enter an email');
                return;
            }
            setError('');
            setIsLoading(true);
            const res = await axios.post('/api/accesskey', { email });
            console.log(res);
            const accessKey = res.data.accessKey;
            setAccessKey(accessKey);
            setIsLoading(false);
        } catch (err: any) {
            setIsLoading(false);
            setError(err.response.data.error || 'Something went wrong while generating the access key, please try again later.');
            console.error(err);
        }
    }

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
            <Input
            type="email"
            variant="bordered"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            errorMessage={error}
            description="Allowed domains: gmail.com, lpu.in, outlook.com, yahoo.com"
            />
            <Button
                color="warning"
                variant="shadow"
                onClick={() => generateAccessKey(email)}
                className="self-end"
            >
                Generate Access Key
            </Button>
            {
                accessKey && (
                    <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-gray-500 text-sm">
                            Your access key is:
                        </p>
                        <p className="text-gray-500 text-sm">
                            {accessKey}
                        </p>
                    </div>
                )
            }
        </div>
    );
}