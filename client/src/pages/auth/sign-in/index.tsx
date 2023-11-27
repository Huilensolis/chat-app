import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../hooks/use-user";

export function SignInPage() {
  const [username, setUsername] = useState("");
  const [hasUsernameInputBeenTouched, setUsernameInputHasBeenTouched] =
    useState<boolean>(false);
  const [isUsernameValid, setIsUsernameValid] = useState<{
    isValid: boolean;
    message?: string;
  }>({ isValid: false, message: "Area cant be empty" });
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);

  const navigate = useNavigate();

  const { logIn } = useUser();

  useEffect(() => {
    if (typeof username !== "string" && hasUsernameInputBeenTouched) {
      return setIsUsernameValid({
        isValid: false,
        message: "Area cant be numeric types",
      });
    }

    if (username.length === 0 && hasUsernameInputBeenTouched) {
      return setIsUsernameValid({
        isValid: false,
        message: "Area cant be empty",
      });
    }
    if (hasUsernameInputBeenTouched) {
      setIsUsernameValid({ isValid: true });
      setIsButtonDisabled(false);
    }
  }, [username, hasUsernameInputBeenTouched]);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();

    setIsButtonDisabled(true);
    setIsInputDisabled(true);

    try {
      const res = await fetch(`http://localhost:3000/user/${username}`, {
        method: "get",
      });
      console.log(res);
      if (res.status === 200) {
        setIsUsernameValid({
          isValid: false,
          message: "User doesnt exist",
        });
        setIsInputDisabled(false);
        return;
      }
      logIn({ username });
      navigate("/app/chat");
    } catch (error) {
      console.log(error);
    }

    setIsInputDisabled(false);
    setIsButtonDisabled(false);
  }

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <form onSubmit={handleSignUp} className="flex flex-col gap-5">
        <div className="flex flex-col">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="p-2 border border-neutral-400 text-neutral-700 rounded-md disabled:bg-gray-400"
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setUsernameInputHasBeenTouched(true)}
            disabled={isInputDisabled}
          />
          {!isUsernameValid.isValid && hasUsernameInputBeenTouched && (
            <span className="text-red-500">
              {isUsernameValid.message ?? "username not valid"}
            </span>
          )}
        </div>
        <button
          className="bg-blue-500 text-neutral-50 font-bold p-2 rounded-md disabled:bg-gray-400"
          disabled={isButtonDisabled}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
