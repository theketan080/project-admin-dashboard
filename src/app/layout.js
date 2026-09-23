import "./globals.css";

export const metadata = {
  title: "Product Admin Dashboard",
  description: "Product management admin dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}