import { useState } from "react";

export function useUser() {
  const [user, setUser] = useState<string | null>(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      return storedUsername;
    }
    return null;
  });

  function logIn({ username }: { username: string }) {
    localStorage.setItem("username", username);
    setUser(username);
  }

  function logOut() {
    localStorage.removeItem("username");
    setUser(null);
  }

  const isUserLoggedIn = user !== null;

  return {
    user,
    isUserLoggedIn,
    logIn,
    logOut,
  };
}
