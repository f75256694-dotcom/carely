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
    <html lang="de">
      <body className="min-h-screen bg-[#FAFAF8] font-sans text-slate-900 selection:bg-teal-100 relative">
        {children}
      </body>
    </html>
  );
}