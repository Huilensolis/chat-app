import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="grid grid-cols-2 grid-rows-1 h-screen w-full">
      <section className="h-full w-full flex justify-center items-center">
        <Outlet />
      </section>
      <section className="h-full w-full">
        <img
          src="/gradient.jpg"
          alt="gradient image"
          className="h-full w-full object-cover object-center"
        />
      </section>
    </div>
  );
}
