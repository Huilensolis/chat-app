import React, { useEffect, useMemo, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

interface CustomSocket extends Socket {
  auth: {
    serverOffset: number;
  };
}

export function ChatPage() {
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);

  const socket = useMemo<CustomSocket>(() => {
    const ioWithAuth = (
      url: string,
      opts?: Parameters<typeof io>[1] & { auth: { serverOffset: number } },
    ) => {
      return io(url, opts) as CustomSocket;
    };
    return ioWithAuth("http://localhost:3000", { auth: { serverOffset: 0 } });
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (typeof inputValue !== "string") return;
    if (inputValue.length === 0) return;

    setIsloading(true);

    socket.emitWithAck("chat message", inputValue);

    setIsloading(false);

    if (inputRef.current) {
      inputRef.current.value = "";
      setInputValue("");
    }
  }
  useEffect(() => {
    function handleMessage(message: string, serverOffset: number) {
      setMessages((prev) => [...prev, message]);
      socket.auth.serverOffset = serverOffset;
    }

    socket.on("chat message", handleMessage);

    return () => {
      socket.off("chat message", handleMessage);
    };
  }, [socket]);
  return (
    <section className="flex flex-col justify-center items-center gap-4 h-full w-full border-2 overflow-hidden border-blue-500 max-w-xl rounded-xl ">
      <article className="w-full min-h-[500px] flex flex-col gap-2 p-2">
        {messages.length >= 1 &&
          messages.map((message: string, index: number) => (
            <p
              key={index}
              className="p-2 bg-blue-500 text-neutral-50 rounded-[0_20px_20px_20px] w-max"
            >
              {message}
            </p>
          ))}
      </article>
      <form
        className="flex justify-center items-center w-full bg-neutral-400"
        onSubmit={sendMessage}
      >
        <input
          type="text"
          placeholder="message"
          className="w-full p-2 bg-neutral-200 border-neutral-400 rounded-sm placeholder:text-neutral-400"
          onChange={(e) => setInputValue(e.target.value)}
          ref={inputRef}
        />
        <button
          className="bg-blue-500 rounded-sm p-2 disabled:grayscale"
          type="submit"
          disabled={isLoading}
        >
          send
        </button>
      </form>
    </section>
  );
}
