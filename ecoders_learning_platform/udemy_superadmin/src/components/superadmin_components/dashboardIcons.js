// src/pages/superadmin_pages/utils/dashboardIcons.js
import React from "react";
import {
  FaEnvelope,
  FaBook,
  FaLayerGroup,
  FaClipboardCheck,
  FaGraduationCap,
  FaUsers,
  FaUserGraduate,
  FaRegChartBar,
  FaUserCheck,
  FaUserClock,
  FaUserTimes,
  FaBell,
  FaPlus,
  FaCog,
  FaBoxOpen,
} from "react-icons/fa";

/* Helpers */
export const coerceNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export const DEFAULT_COUNT_KEYS = {
  blogs: 0,
  categories: 0,
  contacts: 0,
  courses: 0,
  degrees: 0,
  exams: 0,
  instructors: 0,
  notifications: 0,
  questions: 0,
  quizzes: 0,
  semesters: 0,
  subcategories: 0,
  users: 0,
  students: 0,
  activities: 0,
  admissions: 0,
};

/* Subtle tones (no harsh colors) */
const TONE = {
  blogs: "text-indigo-500/90",
  categories: "text-sky-500/90",
  subcategories: "text-sky-500/90",
  contacts: "text-emerald-600/90",
  courses: "text-violet-500/90",
  degrees: "text-indigo-500/90",
  exams: "text-amber-600/90",
  instructors: "text-teal-600/90",
  notifications: "text-rose-500/90",
  questions: "text-fuchsia-600/90",
  quizzes: "text-amber-600/90",
  semesters: "text-cyan-600/90",
  users: "text-slate-600/90",
  students: "text-emerald-600/90",
  activities: "text-violet-500/90",
  admissions: "text-indigo-600/90",
  unread_messages: "text-emerald-600/90",

  // sidebar actions
  settings: "text-slate-600/90",
  add_blog: "text-indigo-500/90",
  add_category: "text-sky-500/90",
  add_subcategory: "text-sky-500/90",
  degree: "text-indigo-500/90",
  semester_add: "text-cyan-600/90",
  course_add: "text-violet-500/90",
  exam_add: "text-amber-600/90",
  student_add: "text-emerald-600/90",
  quiz_add: "text-amber-600/90",
  question_add: "text-fuchsia-600/90",
  notification_add: "text-rose-500/90",
  activity_add: "text-violet-500/90",
  admission_add: "text-indigo-600/90",
  attendance_add: "text-teal-600/90",

  instructors_pending: "text-amber-600/90",
  instructors_approved: "text-emerald-600/90",
  instructors_rejected: "text-rose-600/90",

  default: "text-slate-600/90",
};

/* Which icon to use for which key */
const ICON = {
  blogs: FaBook,
  categories: FaLayerGroup,
  subcategories: FaLayerGroup,
  contacts: FaEnvelope,
  courses: FaRegChartBar,
  degrees: FaGraduationCap,
  exams: FaClipboardCheck,
  instructors: FaUsers,
  notifications: FaBell,
  questions: FaClipboardCheck,
  quizzes: FaClipboardCheck,
  semesters: FaLayerGroup,
  users: FaUsers,
  students: FaUserGraduate,
  activities: FaRegChartBar,
  admissions: FaUserCheck,
  unread_messages: FaEnvelope,

  // sidebar actions
  settings: FaCog,
  add_blog: FaPlus,
  add_category: FaPlus,
  add_subcategory: FaPlus,
  degree: FaBoxOpen,
  semester_add: FaLayerGroup,
  course_add: FaPlus,
  exam_add: FaClipboardCheck,
  student_add: FaUserGraduate,
  quiz_add: FaClipboardCheck,
  question_add: FaClipboardCheck,
  notification_add: FaBell,
  activity_add: FaRegChartBar,
  admission_add: FaUserCheck,
  attendance_add: FaUsers,

  instructors_pending: FaUserClock,
  instructors_approved: FaUserCheck,
  instructors_rejected: FaUserTimes,
};

/**
 * Uniform icon element with adjustable size.
 * Usage:
 *  - Cards: buildIcon(key)              // default 22
 *  - Sidebar: buildIcon(key, {size:16})
 */
export const buildIcon = (key, { size = 22 } = {}) => {
  const I = ICON[key] || FaBoxOpen;
  const tone = TONE[key] || TONE.default;
  return React.createElement(I, { size, className: tone });
};
