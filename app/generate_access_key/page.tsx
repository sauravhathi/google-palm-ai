"use client";
import React, { useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from "@nextui-org/react";
import axios from 'axios';

export default function GenerateAccessKey() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [accessKey, setAccessKey] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [otp, setOtp] = useState('');
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleErrors = (err: { response: { data: { error: any; }; }; }, loading: boolean = false) => {
        setIsLoading(loading);
        setError(err.response.data.error || 'Something went wrong while generating the access key, please try again later.');
    }

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
            handleErrors(err);
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
            setIsSendingEmail(false);
            setIsLoading(true);
            const mail = {
                from: 'testing123@gmail.com',
                to: email,
                subject: 'Google Palm AI Access Key OTP',
                text: `Your OTP is ${otp}`,
                html: `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Google Palm AI Access Key OTP</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f0f0f0;
                                margin: 0;
                                padding: 0;
                            }

                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                border-radius: 5px;
                                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
                            }

                            .header {
                                background-color: #0073e6;
                                color: #ffffff;
                                padding: 20px;
                                text-align: center;
                                border-top-left-radius: 5px;
                                border-top-right-radius: 5px;
                            }

                            h1 {
                                font-size: 24px;
                                margin: 0;
                            }

                            .content {
                                padding: 20px;
                                text-align: center;
                            }

                            p {
                                font-size: 18px;
                                color: #333333;
                                margin: 0;
                            }

                            .otp {
                                font-size: 32px;
                                font-weight: bold;
                                color: #0073e6;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Google Palm AI Access Key OTP</h1>
                            </div>
                            <div class="content">
                                <p>Your One-Time Password (OTP) is:</p>
                                <p class="otp">${otp}</p>
                            </div>
                        </div>
                    </body>
                </html>
                `
            }
            const res = await axios.post('/api/mail', mail);
            if (res.data.success) {
                setIsSendingEmail(true);
                onOpen();
            }
            setIsLoading(false);
        } catch (err: any) {
            handleErrors(err);
        }
    }

    const otpGenerate = async (email: string): Promise<void> => {
        try {
            if (!email) {
                setError('Please enter an email');
                return;
            }
            if (isSendingEmail) {
                setError('OTP already sent, please check your email');
                return;
            }
            setError('');
            setAccessKey('');
            setOtp('');
            setIsLoading(true);
            const res = await axios.post('/api/otp_generate', { email });
            sendEmail(email, res.data.otp);
        } catch (err: any) {
            handleErrors(err);
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
            setIsSendingEmail(false);
            setIsLoading(false);
        } catch (err: any) {
            handleErrors(err);
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
            <div className="flex flex-row gap-2 justify-end">
                {
                    isSendingEmail && (
                        <Button
                            color="success"
                            variant="shadow"
                            className="self-end text-sm md:text-md"
                            onPress={isOpen ? onOpenChange : onOpen}
                        >
                            Verify OTP
                        </Button>
                    )
                }
                <Button
                    isLoading={isLoading}
                    color="warning"
                    variant="shadow"
                    onPress={() => otpGenerate(email)}
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
                    className="text-sm md:text-md"
                    isDisabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Generate Access Key'}
                </Button>
            </div>
            <Modal
                isOpen={isOpen}
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