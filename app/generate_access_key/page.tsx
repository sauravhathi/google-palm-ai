"use client";
import React, { useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from "@nextui-org/react";
import axios from 'axios';

export default function GenerateAccessKey() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [accessKey, setAccessKey] = useState('');
    const [otp, setOtp] = useState('');
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const generateAccessKey = async (email: string): Promise<void> => {
        try {
            if (!email) {
                setError('Please enter an email');
                return;
            }
            setError('');
            setAccessKey('');
            setIsLoading(true);
            const res = await axios.post('/api/accesskey', { email });
            const accessKey = res.data.accessKey;
            setAccessKey(accessKey);
            setIsLoading(false);
        } catch (err: any) {
            setIsLoading(false);
            setError(err.response.data.error || 'Something went wrong while generating the access key, please try again later.');
            console.error(err);
        }
    }

    const sendEmail = async (email: string, otp: string): Promise<void> => {
        try {
            if (!email) {
                setError('Please enter an email');
                return;
            }
            setError('');
            setAccessKey('');
            setIsLoading(true);
            const mail = {
                from: 'testing123@gmail.com',
                to: email,
                subject: 'Google Palm AI Access Key OTP',
                text: `Your OTP is ${otp}`,
                html:
                    `<html>
                    <title>Google Palm AI Access Key OTP</title>
                    <body>
                        <div style="padding: 20px; border-radius: 10px;">
                            <div style="padding: 20px; border-radius: 10px;">
                                <h1 style="text-align: center;">Google Palm AI Access Key OTP</h1>
                                <p style="text-align: center;">Your OTP is ${otp}</p>
                            </div>
                            <div style="padding: 20px; border-radius: 10px; margin-top: 20px;">
                                <p style="text-align: center;">Made with ❤️ by <a href="https://bit.ly/3sEXO8h" target="_blank">Saurav Hathi</a></p>
                                <p style="text-align: center;">Follow me on <a href="https://bit.ly/sauravhathi" target="_blank">GitHub</a> | <a href="https://bit.ly/3R6hUSR" target="_blank">LinkedIn</a> | <a href="https://bit.ly/faq-tel" target="_blank">Telegram</a></p>
                            </div>
                        </div>
                    </body>
                </html>`
            }

            const res = await axios.post('https://b-mailer-vuftqw44dq-uc.a.run.app/api/contact', mail);
            alert('OTP sent to your email');
            setIsLoading(false);
        } catch (err: any) {
            setIsLoading(false);
            setError(err.response.data.error || 'Something went wrong while generating the access key, please try again later.');
            console.error(err);
        }
    }

    const otpGenerate = async (email: string): Promise<void> => {
        try {
            if (!email) {
                setError('Please enter an email');
                return;
            }
            setError('');
            setAccessKey('');
            setOtp('');
            setIsLoading(true);
            const res = await axios.post('/api/otp_generate', { email });
            sendEmail(email, res.data.otp);
            setIsLoading(false);
        } catch (err: any) {
            setIsLoading(false);
            setError(err.response.data.error || 'Something went wrong while generating the access key, please try again later.');
            console.error(err);
        }
    }

    const otpVerify = async (email: string, otp: string): Promise<void> => {
        try {
            if (!email) {
                setError('Please enter an email');
                return;
            }
            setError('');
            setAccessKey('');
            setIsLoading(true);
            const res = await axios.post('/api/otp_verify', { email, otp });
            if (res.data.success) {
                generateAccessKey(email);
            }
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
                isLoading={isLoading}
                color="warning"
                variant="shadow"
                onPress={() => {
                    onOpen();
                    otpGenerate(email);
                }}
                radius='sm'
                spinner={
                    <svg
                        className="animate-spin h-5 w-5 text-current"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            fill="currentColor"
                        />
                    </svg>
                }
                className="self-end text-sm md:text-md"
                isDisabled={isLoading}
            >
                {isLoading ? 'Loading...' : 'Generate Access Key'}
            </Button>
            <Modal
                isOpen={isOpen && !isLoading}
                onOpenChange={onOpenChange}
                placement="top-center"
                radius='sm'
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">OTP</ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    placeholder="Enter your OTP"
                                    variant="faded"
                                    radius='sm'
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button radius='sm' color="danger" variant="flat" onPress={onClose}>
                                    Close
                                </Button>
                                <Button radius='sm' color="primary" onClick={() => {
                                    otpVerify(email, otp);
                                    onClose();
                                }}>
                                    Submit
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {
                accessKey && (
                    <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-gray-500 text-sm">
                            Your access key is:
                        </p>
                        <Button color="primary" variant="flat"
                            onClick={() => {
                                navigator.clipboard.writeText(accessKey);
                                alert('Copied to clipboard');
                            }}
                        >
                            {accessKey}
                        </Button>
                    </div>
                )
            }
        </div>
    );
}