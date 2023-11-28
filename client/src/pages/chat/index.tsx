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
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [chatMembers, setChatMembers] = useState<Set<string>>(new Set());
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

    function handleDissconnect() {
      setIsConnected(false);
    }

    function handleConnect() {
      setIsConnected(true);
    }

    socket.on("chat message", handleMessage);
    socket.on("disconnect", handleDissconnect);
    socket.on("connect", handleConnect);

    return () => {
      socket.off("disconnect", handleDissconnect);
      socket.off("connect", handleConnect);
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

  useEffect(() => {
    const members = new Set<string>();
    for (const message of messages) {
      const user = message.user;

      if (user) {
        members.add(user);
      }
    }
    setChatMembers(members);
  }, [messages]);

  return (
    <section className="flex flex-col justify-center items-center gap-4 h-full max-w-5xl w-full overflow-hidden bg-neutral-800 rounded-xl">
      <header className="w-full p-2 flex items-end gap-4">
        <ul className="flex">
          {Array.from(chatMembers)
            .slice(0, 6)
            .map((user: string) => (
              <li
                key={user}
                className="flex items-center justify-center bg-neutral-700 rounded-full w-12 h-12"
              >
                <p className="text-neutral-400">{user.split("")[0]}</p>
              </li>
            ))}
        </ul>
        <p className="text-neutral-400">
          {Array.from(chatMembers).length} members
        </p>
      </header>
      <div
        className="w-full h-full flex flex-col gap-2 p-2 overflow-auto"
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
              <div
                className={`py-2 px-4 flex flex-col ${
                  message.user !== user
                    ? "rounded-[0_20px_20px_20px] bg-neutral-700"
                    : "rounded-[20px_0_20px_20px] bg-blue-500"
                } w-max max-w-[90%]`}
              >
                <span className="text-sm text-neutral-50">{message.user}</span>
                <p className="text-lg text-neutral-50">{message.message}</p>
              </div>
            </div>
          ))}
      </div>
      <form
        className="flex justify-center items-center w-full relative"
        onSubmit={sendMessage}
      >
        {!isConnected && (
          <span className="absolute -top-12 py-2 px-4 bg-neutral-700 rounded-xl text-neutral-50">
            you are offline
          </span>
        )}
        <input
          type="text"
          placeholder="your message"
          className="w-full p-4 bg-neutral-800 border-neutral-400 rounded-[0_0_0_0.75rem] placeholder:text-neutral-400 text-neutral-50 border-2 border-transparent focus:border-neutral-400 focus:outline-none"
          onChange={(e) => setInputValue(e.target.value)}
          ref={inputRef}
          autoFocus
        />
        <button
          className="bg-blue-500 text-neutral-50 py-2 px-6 disabled:grayscale h-full"
          type="submit"
          disabled={isLoading}
        >
          send
        </button>
      </form>
    </section>
  );
}
