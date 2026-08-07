import './globals.css';

export const metadata = {
  title: 'Carely',
  description: 'Nachbarschaftshilfe neu gedacht',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-[#FAFAF7] font-sans text-gray-900 selection:bg-teal-100 relative">
        {children}
      </body>
    </html>
  );
}