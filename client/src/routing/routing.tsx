import { Navigate, createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./root";
import { ErrorPage } from "./error";
import { ChatPage } from "../pages/chat";
import { AuthLayout } from "../layouts/auth";
import { LogInPage } from "../pages/log-in";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Navigate to="/auth/sign-up" />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
      },
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
          {
            path: "/auth/login",
            element: <LogInPage />,
          },
        ],
      },
    ],
  },
]);
