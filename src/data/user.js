export const USER = {
  id: 'u1',
  name: 'Giulia',
  lastName: 'Romano',
  avatar: 'GR',
  level: 'Intermedio',
  joinDate: '2024-09-01',
  streakDays: 12,
  totalSessions: 47,
  totalMinutes: 1410,
  totalHours: 23.5,
  weeklyGoal: 4,
  weeklyCompleted: 3,
};

export const SCHEDULE = [
  {
    id: 's1',
    day: 'Lun',
    date: '24',
    hasClass: true,
    classes: [
      { id: 'sc1', time: '07:30', title: 'Pilates Base – Lez. 4', instructor: 'Sofia Martini', duration: 35, courseId: '1', lessonId: 'l1_4' },
    ],
  },
  {
    id: 's2',
    day: 'Mar',
    date: '25',
    hasClass: false,
    classes: [],
  },
  {
    id: 's3',
    day: 'Mer',
    date: '26',
    hasClass: true,
    classes: [
      { id: 'sc2', time: '18:00', title: 'Core & Forza – Lez. 2', instructor: 'Marco Ferretti', duration: 35, courseId: '2', lessonId: 'l2_2' },
    ],
  },
  {
    id: 's4',
    day: 'Gio',
    date: '27',
    hasClass: false,
    classes: [],
  },
  {
    id: 's5',
    day: 'Ven',
    date: '28',
    hasClass: true,
    classes: [
      { id: 'sc3', time: '07:30', title: 'Stretching Pilates – Lez. 1', instructor: 'Elena Conti', duration: 30, courseId: '6', lessonId: 'l6_1' },
      { id: 'sc4', time: '19:00', title: 'Pilates & Respirazione', instructor: 'Sofia Martini', duration: 25, courseId: '4', lessonId: 'l4_1' },
    ],
  },
  {
    id: 's6',
    day: 'Sab',
    date: '29',
    hasClass: true,
    classes: [
      { id: 'sc5', time: '10:00', title: 'Pilates Base – Lez. 5', instructor: 'Sofia Martini', duration: 30, courseId: '1', lessonId: 'l1_5' },
    ],
  },
  {
    id: 's7',
    day: 'Dom',
    date: '30',
    hasClass: false,
    classes: [],
  },
];

export const MY_COURSES = [
  { courseId: '1', progress: 37.5, lastLessonId: 'l1_4', completedLessons: ['l1_1', 'l1_2', 'l1_3'] },
  { courseId: '2', progress: 16.7, lastLessonId: 'l2_2', completedLessons: ['l2_1'] },
  { courseId: '6', progress: 0, lastLessonId: 'l6_1', completedLessons: [] },
];

export const ACHIEVEMENTS = [
  { id: 'a1', title: 'Prima Sessione', icon: '🌱', description: 'Hai completato la tua prima lezione', unlocked: true },
  { id: 'a2', title: 'Streak 7 giorni', icon: '🔥', description: 'Hai allenato 7 giorni di fila', unlocked: true },
  { id: 'a3', title: '10 Sessioni', icon: '⭐', description: 'Hai completato 10 sessioni', unlocked: true },
  { id: 'a4', title: 'Mattiniero', icon: '🌅', description: '5 sessioni mattutine completate', unlocked: true },
  { id: 'a5', title: 'Primo Corso', icon: '🎓', description: 'Hai completato il tuo primo corso', unlocked: false },
  { id: 'a6', title: 'Power 30', icon: '💪', description: '30 sessioni totali completate', unlocked: true },
  { id: 'a7', title: 'Streak 30 giorni', icon: '🏆', description: '30 giorni di fila', unlocked: false },
  { id: 'a8', title: 'Esperto', icon: '🧘', description: 'Completa un corso avanzato', unlocked: false },
];
