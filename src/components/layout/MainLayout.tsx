import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
  navbarVariant?: "default" | "dark";
  hideNavbar?: boolean;
}

const MainLayout = ({ children, hideFooter = false, navbarVariant = "default", hideNavbar = false }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <Navbar variant={navbarVariant} />}
      <main className="flex-grow flex flex-col">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
