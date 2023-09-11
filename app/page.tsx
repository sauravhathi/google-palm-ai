"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card, CardHeader, Button, Textarea, Checkbox, Avatar, useDisclosure, Modal, Input, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import axios from 'axios';
import { remark } from 'remark';
import html from 'remark-html';

export default function Home() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isMarkdown, setIsMarkdown] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const ACCESS_KEY = process.env.NEXT_PUBLIC_ACCESS_KEY;

  const [accessKey, setAccessKey] = useState<string | undefined>(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(process.env.NODE_ENV);
      return ACCESS_KEY;
    }
    else {
      if (typeof window !== 'undefined') {
        const storedAccessKey = localStorage.getItem('accessKey') || '';
        return storedAccessKey;
      }
    }
  });
  
  const handleAccessKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setAccessKey(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessKey', newValue);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }

  const handleSubmit = async () => {
    try {
      if (!text) {
        setError('Please enter a prompt');
        return;
      }
      setError('');
      setResult('');
      setIsLoading(true);
      const res = await axios.post('/api/generate',
        { prompt: text },
        {
          headers: {
            authorization: accessKey
          }
        }
      );

      const { data } = res;
      const { candidates } = data[0];
      const { output } = candidates[0];
      setResult(output);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response.data.error || 'Something went wrong while generating the text, please try again later.');
      console.error(err);
    }
  }

  const handleCopy = () => {
    const copyText = document.getElementById(!isMarkdown ? 'markdown' : 'text')?.innerText;
    navigator.clipboard.writeText(copyText || '');
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  }

  useEffect(() => {
    (async () => {
      const processed = await remark().use(html).process(result);
      setMarkdown(processed.toString());
    })();

    if (result) {
      textRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result]);

  return (
    <>
      <a className={'flex flex-row items-center justify-center gap-5' + (isAvatarHovered ? ' animate-bounce' : '')} href="https://github.com/sauravhathi/google-palm-ai" target="_blank" rel="noopener noreferrer">
        <h1 className="text-4xl font-bold text-center">
          Google Palm Ai
        </h1>
        <Avatar isBordered color="primary" size='lg' src="https://github.com/sauravhathi/sauravhathi/assets/61316762/a333b8ba-a49e-43ce-b81c-4481f0e8fce0" onMouseEnter={() => setIsAvatarHovered(true)} onMouseLeave={() => setIsAvatarHovered(false)} className="w-16 h-16" />
      </a>
      <div className="flex flex-col items-center justify-center gap-10 px-5 md:px-0">
        <div className="max-w-2xl w-full flex flex-col gap-2">
          <div>
            <label className="font-bold text-large">Ask a question</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-transparent"
              placeholder="Enter your prompt here"
              value={text}
              onChange={handleChange as any}
              rows={6}
            />
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </div>
          <div className="flex flex-row justify-end gap-2 md:gap-5">
            <Button onPress={onOpen} color="primary" radius='sm' className="text-sm md:text-md">
              Set Access Key
            </Button>
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              placement="top-center"
              radius='sm'
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">Access Key</ModalHeader>
                    <ModalBody>
                      <Input
                        autoFocus
                        placeholder="Enter your access key"
                        variant="faded"
                        radius='sm'
                        value={accessKey}
                        onChange={handleAccessKeyChange}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button radius='sm' color="danger" variant="flat" onPress={onClose}>
                        Close
                      </Button>
                      <Button radius='sm' color="primary" onPress={onClose}>
                        Submit
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
            <Button color="primary" variant="ghost" radius='sm' onClick={() => setAccessKey('')} className="text-sm md:text-md">
              <Link href="/generate_access_key">
                Generate Access Key
              </Link>
            </Button>
            <Button
              isLoading={isLoading}
              color="warning"
              variant="shadow"
              onClick={handleSubmit}
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
              {isLoading ? 'Loading...' : 'Generate'}
            </Button>
          </div>
        </div>
        <div className="max-w-2xl w-full flex flex-col gap-4" ref={textRef as any}>
          <h4 className="font-bold text-large">Result</h4>
          <Checkbox
            isSelected={isMarkdown}
            onChange={() => setIsMarkdown(!isMarkdown)}
            radius="full"
          >
            Markdown
          </Checkbox>
          <Card
            isFooterBlurred
            radius='sm'
            className={result ? '' : 'h-28' + ' overflow-hidden bg-transparent border border-gray-300'}
          >
            {result && (
              <>
                <CardHeader className="flex justify-end p-2 pb-8 -z-1">
                  <Button
                    className={isCopied ? 'border-default-200' : 'text-gray-500'}
                    variant={isCopied ? "light" : "bordered"}
                    onClick={handleCopy}
                    radius='sm'
                    size='sm'
                  >
                    {isCopied ? 'Copied!' : 'Copy'}
                  </Button>
                </CardHeader>
                <pre
                  dangerouslySetInnerHTML={{
                    __html: !isMarkdown ? markdown : result
                  }}
                  className="px-4 pb-4 -mt-6 overflow-scroll max-h-96 pretty-scrollbar"
                  id={!isMarkdown ? 'markdown' : 'text'}
                />
              </>
            )}

            {!result && (
              <p className='px-4 pb-4 mt-5 text-gray-500'>
                Your result will appear here
              </p>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
