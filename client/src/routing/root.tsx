import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <div className="bg-neutral-50 flex flex-col items-center justify-center px-40 py-20 min-h-screen w-full">
      <Outlet />
    </div>
  );
}
