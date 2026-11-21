export const SEMINAR = {
  key: 'paper-1-final-boost',
  title: '100න් 1ක්',
  subtitle: 'O/L Maths Paper I Final Boost',
  time: 'පෙ.ව. 8.30 සිට ප.ව. 4.00 දක්වා',
  venue: 'ROVISTA, මතුගම',
  teacher: 'මිගාර වික්‍රමාරච්චි',
  phone: '94729780053',
  group: 'https://chat.whatsapp.com/Jb8s7BYhlxo8txOQAVwKsT?s=sw&p=i&iam=2',
};
export const whatsappLink = (phone, message) => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
export function studentMessage(row) {
  return `ආයුබෝවන් ${row.student_name}!\nMathsbook “100න් 1ක් — O/L Maths Paper I Final Boost” සඳහා ඔබගේ උනන්දුව ලියාපදිංචි කරගත්තා.\n📍 ${SEMINAR.venue}\n🕣 ${SEMINAR.time}\nදිනය සහ ගාස්තුව තහවුරු කළ පසු දැනුම් දෙන්නම්. මෙය ගෙවූ ආසනයක් තහවුරු කිරීමක් නොවේ.\nතොරතුරු සඳහා WhatsApp සමූහයට එක්වන්න:\n${SEMINAR.group}\n— ${SEMINAR.teacher}`;
}
