import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="p-20 flex flex-col">
      <Outlet />
    </div>
  );
}
