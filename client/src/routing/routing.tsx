import { Navigate, createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./root";
import { ErrorPage } from "./error";
import { ChatPage } from "../pages/chat";
import { AuthLayout } from "../layouts/auth";
import { SignInPage } from "../pages/auth/sign-in";
import { SignUpPage } from "../pages/auth/sign-up";
import { AppLayout } from "../layouts/app";
import { ReactNode } from "react";
import { useUser } from "../hooks/use-user";

// eslint-disable-next-line react-refresh/only-export-components
function CheckAuth({ children }: { children: ReactNode }) {
  const { isUserLoggedIn } = useUser();
  if (isUserLoggedIn) {
    return <Navigate to="/app/chat" />;
  }

  return children;
}
function ProtectRouteFromUnAuth({ children }: { children: ReactNode }) {
  const { isUserLoggedIn, user } = useUser();

  if (!isUserLoggedIn || !user) {
    return <Navigate to="/auth/sign-in" />;
  }
  return children;
}
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Navigate to="/auth/sign-in" />,
      },
      {
        path: "/app",
        element: (
          <ProtectRouteFromUnAuth>
            <AppLayout />
          </ProtectRouteFromUnAuth>
        ),
        children: [
          {
            path: "/app/chat",
            element: <ChatPage />,
          },
        ],
      },
      {
        path: "/auth",
        element: (
          <CheckAuth>
            <AuthLayout />
          </CheckAuth>
        ),
        children: [
          {
            path: "/auth/sign-in",
            element: <SignInPage />,
          },
          {
            path: "/auth/sign-up",
            element: <SignUpPage />,
          },
        ],
      },
    ],
  },
]);
