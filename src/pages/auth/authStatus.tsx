import {useAuth } from "@src/shared/guards/AuthContext";
const AuthStatus = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <div>
      <p>Welcome, {user}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
export default AuthStatus