// Example: simple Authenticator.tsx snippet
import { useState } from "react";
import type {ReactNode} from "react";

interface AuthenticatorProps {
  children?: ReactNode;
}

const Authenticator = ({ children }: AuthenticatorProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <div className="tooltip tooltip-bottom" data-tip="Login">
        <button className="btn btn-ghost" onClick={()=>(document.getElementById('auth-modal') as HTMLDialogElement)?.showModal()}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </button>
      </div>

      <dialog id="auth-modal" className="modal bg-base">
        <div className="modal-box flex flex-col gap-4">
          <span className="text-xl font-bold w-full text-center">Authenticate</span>
          <div className="flex flex-row gap-2">
            <input
              className="input flex-grow"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="input flex-grow"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-info w-full" onClick={() => login(username, password)}>Login</button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {children}
    </div>
  );
};

// Example login function
async function login(username: String, password: String) {
  try {
    const res = await fetch("http://localhost:3001/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("userId", data.id);
      alert("Login successful!");
    } else {
      alert("Login failed: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Login request failed");
  }
};

export default Authenticator;