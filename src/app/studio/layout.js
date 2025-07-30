export const metadata = {
  title: "Admin Dashboard | Cartzi",
  description: "Admin | Discover premium fashion handpicked for bold personalities.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
