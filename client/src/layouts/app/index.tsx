import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="p-20 flex flex-col w-full h-full justify-center items-center">
      <Outlet />
    </div>
  );
}
