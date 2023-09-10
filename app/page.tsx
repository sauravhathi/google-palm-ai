"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, Button, Textarea, Checkbox, Avatar } from "@nextui-org/react";
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
      const res = await axios.post('/api/generate', { prompt: text });
      const { data } = res;
      const { candidates } = data[0];
      const { output } = candidates[0];
      setResult(output);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError('Something went wrong');
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

    textRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [result]);

  return (
    <main className="min-h-screen flex flex-col gap-10 mt-10 md:mt-20 relative">
      <a className={'flex flex-row items-center justify-center gap-5' + (isAvatarHovered ? ' animate-bounce' : '')} href="https://github.com/sauravhathi/google-palm-ai" target="_blank" rel="noopener noreferrer">
        <h1 className="text-4xl font-bold text-center">
          Google Palm Ai
        </h1>
        <Avatar isBordered color="primary" size='lg' src="https://github.com/sauravhathi/sauravhathi/assets/61316762/a333b8ba-a49e-43ce-b81c-4481f0e8fce0" onMouseEnter={() => setIsAvatarHovered(true)} onMouseLeave={() => setIsAvatarHovered(false)} className={isAvatarHovered ? 'w-16 h-16' : 'w-12 h-12'} />
      </a>
      <div className="flex flex-col items-center justify-center gap-10 px-10 md:px-0">
        <div className="max-w-2xl w-full flex flex-col gap-2">
          <div>
            <label className="font-bold text-large">Ask a question</label>
            <Textarea
              variant="faded"
              size="lg"
              radius='sm'
              labelPlacement="outside"
              placeholder="Enter your prompt here"
              value={text}
              onChange={handleChange as any}
              errorMessage={error}
              maxRows={20}
            />
          </div>
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
            className="self-end"
            isDisabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Submit'}
          </Button>
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
            className={result ? '' : 'h-28' + ' overflow-hidden'}
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
      <footer className="flex flex-col items-center justify-center gap-2 mb-10">
        <p className="text-gray-500 text-sm">
          Made with ❤️ by <a href="https://github.com/sauravhathi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:underline">Saurav Hathi</a>
        </p>
      </footer>
    </main >
  )
}
