import Navbar from "../../components/Navbar";
import Footer from "../../components/layout/Footer";
import WhatsAppFloat from "../../components/ui/WhatsAppFloat";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
