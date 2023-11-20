import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <div className="bg-neutral-300 flex flex-col px-40 py-20 min-h-screen w-full">
      <Outlet />
    </div>
  );
}
