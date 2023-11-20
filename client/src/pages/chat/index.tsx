import { io } from "socket.io-client";

export function ChatPage() {
  const socket = io("http://localhost:3000");
  socket.on("message", (message) => {
    console.log(message);
  });
  return (
    <section className="flex flex-col justify-center items-center gap-4 h-full w-full">
      <article>here go the messages</article>
      <form className="flex gap-2">
        <input
          type="text"
          placeholder="message"
          className="border-neutral-400 rounded-sm placeholder:text-neutral-400"
        />
        <button className="bg-blue-400 rounded-sm p-1" type="submit">
          send
        </button>
      </form>
    </section>
  );
}
