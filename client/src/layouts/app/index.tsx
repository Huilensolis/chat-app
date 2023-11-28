import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="bg-neutral-950 h-screen p-20 flex flex-col w-full justify-center items-center">
      <Outlet />
    </div>
  );
}
