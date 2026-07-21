import './globals.css';

export const metadata = {
  title: 'mathsbook - සිංහල මාධ්‍ය ගණිත පන්තිය | Migara Wickramarachchi',
  description: 'තර්කානුකූල සිද්ධාන්ත, ක්‍රමවත් ප්‍රශ්න පත්‍ර සාකච්ඡාව සහ විශේෂිත කෙටි ක්‍රම මඟින් ගණිතය විෂයට ඉහළම ලකුණු තහවුරු කෙරෙන සිංහල මාධ්‍ය ගණිත පන්තිය.',
  keywords: ['mathsbook', 'Migara Wickramarachchi', 'O/L Mathematics', 'Sinhala Medium Math', 'Gemini AI Math Solver'],
  authors: [{ name: 'Migara Wickramarachchi' }]
};

export const viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="si" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
