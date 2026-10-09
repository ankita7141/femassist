export const ZONES = [
  { id: 'head',  label: 'Mental Well-being',   icon: '🧠' },
  { id: 'chest', label: 'Heart & Energy',      icon: '💗' },
  { id: 'belly', label: 'Menstrual & Hormonal',icon: '🌸' },
  { id: 'bones', label: 'Bone Health',         icon: '🦴' },
  { id: 'legs',  label: 'Movement & Fitness',  icon: '🏃' },
];

export const LESSONS = [
  {
    id: 'hemoglobin',
    icon: '🩸',
    zone: 'chest',
    title: 'Understanding Hemoglobin',
    duration: '2 min',
    summary: 'What hemoglobin is, why it matters, and what affects it.',
    content: [
      { type: 'text', value: 'Hemoglobin is a protein in your red blood cells. It carries oxygen from your lungs to the rest of your body.' },
      { type: 'text', value: 'When hemoglobin is low, your body may feel tired, weak, or short of breath. This is often called anemia.' },
      { type: 'text', value: 'Common causes include iron deficiency, blood loss, or certain health conditions. Diet, cycle patterns, and other factors can all play a role.' },
      { type: 'callout', value: 'This lesson is educational. For any concerns, always talk to a healthcare professional.' },
    ],
    quiz: [
      { q: 'What does hemoglobin help your body do?', options: ['Digest food', 'Carry oxygen', 'Control temperature', 'Produce hormones'], answer: 1 },
      { q: 'Which is a common sign of low hemoglobin?', options: ['Extra energy', 'Feeling tired', 'Sharper vision', 'Faster hair growth'], answer: 1 },
      { q: 'Which nutrient is commonly linked to hemoglobin levels?', options: ['Iron', 'Calcium', 'Sodium', 'Sugar'], answer: 0 },
    ],
  },
  {
    id: 'pcos-basics',
    icon: '💜',
    zone: 'belly',
    title: 'PCOS: The Basics',
    duration: '3 min',
    summary: 'A simple introduction to Polycystic Ovary Syndrome.',
    content: [
      { type: 'text', value: 'PCOS (Polycystic Ovary Syndrome) is a common hormonal condition that affects how the ovaries work.' },
      { type: 'text', value: 'It can cause irregular periods, acne, weight changes, and sometimes difficulty conceiving.' },
      { type: 'text', value: 'PCOS is manageable. Diet, movement, sleep, and medical guidance all help.' },
      { type: 'callout', value: 'If you suspect PCOS, a doctor can help confirm and guide you.' },
    ],
    quiz: [
      { q: 'PCOS mainly affects which system?', options: ['Digestive', 'Hormonal', 'Skeletal', 'Immune'], answer: 1 },
      { q: 'Which is a common sign of PCOS?', options: ['Regular periods', 'Irregular periods', 'Better sleep', 'Higher height'], answer: 1 },
    ],
  },
  {
    id: 'cycle-basics',
    icon: '🌸',
    zone: 'belly',
    title: 'Your Cycle, Explained',
    duration: '2 min',
    summary: 'The four phases of a menstrual cycle, simply explained.',
    content: [
      { type: 'text', value: 'A typical cycle has four phases: menstruation, follicular, ovulation, and luteal.' },
      { type: 'text', value: 'Cycles vary from person to person. 21–35 days is common, but anything consistent for you is your normal.' },
      { type: 'text', value: 'Tracking your cycle helps you notice patterns in mood, energy, and symptoms.' },
    ],
    quiz: [
      { q: 'Roughly how many phases does a cycle have?', options: ['Two', 'Three', 'Four', 'Six'], answer: 2 },
      { q: 'Which phase involves the release of an egg?', options: ['Menstruation', 'Follicular', 'Ovulation', 'Luteal'], answer: 2 },
    ],
  },
  {
    id: 'iron-rich-foods',
    icon: '🥗',
    zone: 'chest',
    title: 'Iron-Rich Foods',
    duration: '2 min',
    summary: 'Everyday foods that support healthy iron levels.',
    content: [
      { type: 'text', value: 'Iron comes in two forms: heme (from meat) and non-heme (from plants).' },
      { type: 'text', value: 'Good sources: spinach, lentils, chickpeas, tofu, red meat, pumpkin seeds.' },
      { type: 'text', value: 'Vitamin C helps your body absorb plant iron — pair spinach with lemon or orange.' },
    ],
    quiz: [
      { q: 'Which vitamin helps absorb plant iron?', options: ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'], answer: 2 },
      { q: 'Which food is a good plant source of iron?', options: ['Rice', 'Lentils', 'Butter', 'Sugar'], answer: 1 },
    ],
  },
  {
    id: 'sleep-hormones',
    icon: '😴',
    zone: 'head',
    title: 'Sleep & Hormones',
    duration: '2 min',
    summary: 'How sleep affects mood and hormones.',
    content: [
      { type: 'text', value: 'Sleep is when your body resets hormones that control mood, appetite, and stress.' },
      { type: 'text', value: 'Poor sleep can make PMS symptoms feel stronger and mood swings more noticeable.' },
      { type: 'text', value: 'Aim for a consistent bedtime and 7–9 hours when possible.' },
    ],
    quiz: [
      { q: 'Sleep helps reset which system?', options: ['Hormonal', 'Skeletal', 'Digestive only', 'Immune only'], answer: 0 },
    ],
  },
  {
    id: 'menopause-intro',
    icon: '🌺',
    zone: 'bones',
    title: 'Menopause: What to Expect',
    duration: '3 min',
    summary: 'A gentle introduction to the menopausal transition.',
    content: [
      { type: 'text', value: 'Menopause is a natural stage — usually around age 45–55 — when periods stop.' },
      { type: 'text', value: 'Common changes: hot flashes, sleep changes, mood shifts, and bone health considerations.' },
      { type: 'text', value: 'Every journey is different. Doctors can help manage symptoms if needed.' },
    ],
    quiz: [
      { q: 'Menopause typically occurs around which age range?', options: ['20–30', '30–40', '45–55', '70+'], answer: 2 },
    ],
  },
];

export function getLessonById(id) {
  return LESSONS.find((l) => l.id === id);
}