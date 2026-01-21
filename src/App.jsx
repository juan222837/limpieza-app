import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Calendar from "./pages/Calendar";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <Dashboard />;
}
