import { Link, Outlet, useLocation } from "react-router-dom";

export function AuthLayout() {
  const currentPath = useLocation().pathname;
  return (
    <div className="grid grid-cols-2 grid-rows-1 h-screen w-full">
      <section className="h-full w-full flex flex-col justify-center items-start">
        <header className="p-2 bg-neutral-200 w-full flex items-center justify-end">
          <Link
            to={
              currentPath === "/auth/sign-in"
                ? "/auth/sign-up"
                : "/auth/sign-in"
            }
            className="text-blue-500 rounded-md p-2 flex items-center justify-center font-bold"
          >
            {currentPath === "/auth/sign-in" ? "Sign In" : "Sign Up"}
          </Link>
        </header>
        <div className="h-full w-full">
          <Outlet />
        </div>
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
