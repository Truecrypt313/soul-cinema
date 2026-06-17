import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center px-6">
        <h1 className="text-6xl font-black mb-4">404</h1>
        <p className="text-muted-foreground mb-6">Seite nicht gefunden: {location.pathname}</p>
        <Link to="/" className="underline">Zurück zur Startseite</Link>
      </div>
    </div>
  );
};

export default NotFound;
