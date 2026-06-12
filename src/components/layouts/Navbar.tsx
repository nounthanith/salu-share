import { ThemeToggle } from "../ui/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="bg-background border-b border-border">
      <div className="container max-w-5xl flex items-center justify-between mx-auto px-4 py-3">
        <div className="text-xl font-bold">Salu</div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
