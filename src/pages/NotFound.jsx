import { Link } from "react-router-dom";
import { Home, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center eco-gradient p-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-eco-mint">
          <Leaf className="h-12 w-12 text-primary" />
        </div>
        <h1 className="mb-2 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-2 text-xl font-medium text-foreground">Page Not Found</p>
        <p className="mb-8 text-muted-foreground">
          Looks like you've wandered off the eco-path.
        </p>
        <Link to="/dashboard">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
