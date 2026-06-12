import { ThemeToggle } from "../ui/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">Anonymous Post</div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
