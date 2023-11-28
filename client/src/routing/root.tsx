import { Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <Outlet />
    </div>
  );
}
