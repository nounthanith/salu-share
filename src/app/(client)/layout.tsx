import Navbar from "@/components/layouts/Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-16">{children}</main>
    </div>
  );
}
