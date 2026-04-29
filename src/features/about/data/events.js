// src/features/about/data/events.js

function makeDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

export const ACADEMY_EVENTS = [
  {
    id: 1,
    title: "IELTS Mock Test Day",
    date: makeDate(5),
    time: "09:00 - 13:00",
    type: "Exam Simulation",
    location: "Main Campus, Room 301",
    description:
      "Full IELTS simulation under real exam conditions. Detailed feedback within 48 hours.",
    spots: 20,
    spotsLeft: 8,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Speaking Masterclass: Band 7+ Strategies",
    date: makeDate(10),
    time: "15:00 - 17:00",
    type: "Workshop",
    location: "Conference Hall B",
    description:
      "Intensive speaking practice with Dr. Mitchell. Focus on Part 2 long turns and Part 3 discussion.",
    spots: 25,
    spotsLeft: 12,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Writing Task 2: Essay Structures",
    date: makeDate(14),
    time: "14:00 - 16:30",
    type: "Workshop",
    location: "Room 205",
    description:
      "Learn proven structures for Opinion, Discussion, and Problem-Solution essays.",
    spots: 30,
    spotsLeft: 5,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=300&fit=crop",
  },
  {
    id: 4,
    title: "University Application Workshop",
    date: makeDate(18),
    time: "16:00 - 18:00",
    type: "Seminar",
    location: "Main Auditorium",
    description:
      "Guidance on UK, US, and Australian university applications. Personal statement writing tips.",
    spots: 50,
    spotsLeft: 23,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=300&fit=crop",
  },
  {
    id: 5,
    title: "Listening: Advanced Strategies",
    date: makeDate(22),
    time: "10:00 - 12:00",
    type: "Workshop",
    location: "Room 302",
    description:
      "Master Section 3 and 4 with prediction techniques and note-taking strategies.",
    spots: 20,
    spotsLeft: 15,
    featured: false,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop",
  },
  {
    id: 6,
    title: "Graduation Ceremony: Spring 2026",
    date: makeDate(35),
    time: "18:00 - 20:00",
    type: "Ceremony",
    location: "Grand Hall",
    description:
      "Celebrating students who achieved their target bands. Awards and certificates presentation.",
    spots: 100,
    spotsLeft: 45,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=300&fit=crop",
  },
];
