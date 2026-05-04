import './globals.css'
import { Heebo } from 'next/font/google'
import AccessibilityWidget from "../components/AccessibilityWidget";
import SecurityLayer from "../components/SecurityLayer";

const heebo = Heebo({
  subsets: ['hebrew'],
  weight: ['300', '400', '500', '700', '900'],
})

export default function RootLayout({ children }) {
return (
  <html lang="he" dir="rtl">
<body className={heebo.className}>
  <SecurityLayer />
  <AccessibilityWidget />
  {children}
</body>
  </html>
);
}
