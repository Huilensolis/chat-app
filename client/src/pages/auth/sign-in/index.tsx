export function SignInPage() {
  function handleLogIn() {}

  return (
    <form onSubmit={handleLogIn} className="flex flex-col gap-5">
      <div className="flex flex-col">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          className="p-2 border border-neutral-400 text-neutral-700 rounded-md"
        />
      </div>
      <button className="bg-blue-500 text-neutral-500 font-bold p-2 rounded-md">
        Log In
      </button>
    </form>
  );
}
