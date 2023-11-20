import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./root";
import { ErrorPage } from "./error";
import { ChatPage } from "../pages/chat";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <ChatPage />,
      },
    ],
  },
]);
