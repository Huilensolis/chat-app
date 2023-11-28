import React, { useEffect, useMemo, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useUser } from "../../hooks/use-user";
import { Navigate } from "react-router-dom";

interface CustomSocket extends Socket {
  auth: {
    serverOffset: number;
  };
}

export function ChatPage() {
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<{ message: string; user: string }[]>(
    [],
  );
  const [isLoading, setIsloading] = useState<boolean>(false);

  const { user, isUserLoggedIn } = useUser();

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
  const messagesRef = useRef<HTMLDivElement>(null);

  async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (typeof inputValue !== "string") return;
    if (inputValue.length === 0) return;
    if (!isUserLoggedIn || !user) return <Navigate to="/auth/sign-in" />;

    setIsloading(true);

    socket.emitWithAck("chat message", inputValue, user);
    setIsloading(false);

    if (inputRef.current) {
      inputRef.current.value = "";
      setInputValue("");
    }
  }
  useEffect(() => {
    function handleMessage(
      message: string,
      serverOffset: number,
      user: string,
    ) {
      setMessages((prev) => [...prev, { message, user }]);
      socket.auth.serverOffset = serverOffset;
    }

    socket.on("chat message", handleMessage);

    return () => {
      socket.off("chat message", handleMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (messagesRef.current && user && messages.length > 1) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, user]);

  return (
    <section className="flex flex-col justify-center items-center gap-4 h-full max-w-5xl w-full border-2 overflow-hidden border-blue-500 rounded-xl ">
      <div
        className="w-full h-96 flex flex-col gap-2 p-2 overflow-auto"
        ref={messagesRef}
      >
        {messages.length >= 1 &&
          messages.map((message, index: number) => (
            <div
              key={index}
              className={`flex flex-col ${
                message.user === user ? "items-end" : "items-start"
              }`}
            >
              <p
                key={index}
                className={`p-2 text-neutral-50 ${
                  message.user !== user
                    ? "rounded-[0_20px_20px_20px] bg-green-500"
                    : "rounded-[20px_0_20px_20px] bg-blue-500"
                } w-max`}
              >
                {message.message}
              </p>
              {message.user !== user && (
                <span className="text-sm text-neutral-500 px-2">
                  {message.user}
                </span>
              )}
            </div>
          ))}
      </div>
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
          autoFocus
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
