import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <div className="bg-neutral-50 flex flex-col items-center justify-center min-h-screen w-full">
      <Outlet />
    </div>
  );
}
