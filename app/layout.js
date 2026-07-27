import "./globals.css";

export const metadata = {
  title: "PeoplePilot — HR, handled.",
  description: "The virtual HR team for small businesses. Onboarding, compliance, time off, benefits and payroll visibility in one calm place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
