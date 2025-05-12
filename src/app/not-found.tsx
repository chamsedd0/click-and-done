import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <div className="mt-6 border-l-4 border-primary pl-6 md:pl-8 py-2 md:py-4 bg-muted/20 rounded-r-md">
          <h2 className="text-2xl font-medium">This page could not be found.</h2>
          <p className="mt-2 text-muted-foreground">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="mt-8">
          <Link 
            href="/" 
            className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
} 