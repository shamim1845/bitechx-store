import Protected from "@/components/Protected";
import Header from "@/components/Header";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Protected>
      <div className="min-h-screen">
        <Header />
        {children}
      </div>
    </Protected>
  );
}
