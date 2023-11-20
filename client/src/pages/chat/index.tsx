import React, { useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";

export function ChatPage() {
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const socket = useMemo(() => {
    return io("http://localhost:3000");
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  socket.on("chat message", (message) => {
    setMessages([...messages, message]);
  });

  function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    console.log(inputValue);
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
