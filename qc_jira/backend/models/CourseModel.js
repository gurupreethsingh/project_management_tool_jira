const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema for Instructors
const instructorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: String,
    profileImage: String,
    department: { type: String, required: true },
    position: { type: String, required: true },
    qualifications: [String],
    officeHours: String,
    phoneNumber: String,
    salary: { type: Number, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    payment: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

// Define the schema for Courses
const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    categories: [{ type: String, required: true }], // Multiple categories for the course
    courseCode: { type: String, unique: true, required: true },
    credits: { type: Number, required: true },
    semester: String,
    schedule: [
      {
        day: String,
        startTime: String,
        endTime: String,
      },
    ],
    syllabus: String, // Can store a URL to the syllabus document or text
    content: [
      {
        title: String,
        videoUrl: String,
        duration: Number,
        resources: [String],
      },
    ],
    price: {
      amount: { type: Number, required: true, default: 0 },
      isFree: { type: Boolean, default: false },
    },
    instructor: [{ type: Schema.Types.ObjectId, ref: "Instructor" }],
    studentsEnrolled: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    totalEnrollments: { type: Number, default: 0 },
    ratings: [
      {
        student: { type: Schema.Types.ObjectId, ref: "Student" },
        rating: { type: Number, min: 1, max: 5 },
        review: String,
        date: { type: Date, default: Date.now },
      },
    ],
    requirements: [String],
    language: { type: String, default: "English" },
    exams: [{ type: Schema.Types.ObjectId, ref: "Exam" }], // Link to associated exams
  },
  { timestamps: true }
);

//
// Define the schema for Exams
const examSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    duration: { type: Number, required: true }, // in minutes
    totalMarks: { type: Number, required: true },
    passingMarks: { type: Number, required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true }, // Link to the course
    studentsEnrolled: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    results: [
      {
        student: { type: Schema.Types.ObjectId, ref: "Student" },
        marksObtained: Number,
        status: { type: String, enum: ["Pass", "Fail"], required: true },
      },
    ],
  },
  { timestamps: true }
);

// Define the schema for Students
const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    coursesEnrolled: [
      {
        course: { type: Schema.Types.ObjectId, ref: "Course" },
        enrollmentDate: { type: Date, default: Date.now },
        completionDate: Date, // Date when the student completes the course
      },
    ],
    exams: [
      {
        exam: { type: Schema.Types.ObjectId, ref: "Exam" },
        dateScheduled: Date,
        marksObtained: Number,
        status: {
          type: String,
          enum: ["Pending", "Completed"],
          default: "Pending",
        },
      },
    ],
    paymentDetails: [
      {
        course: { type: Schema.Types.ObjectId, ref: "Course" },
        amountPaid: { type: Number, required: true },
        paymentDate: { type: Date, default: Date.now },
        transactionId: String,
      },
    ],
  },
  { timestamps: true }
);

// Models
const Instructor = mongoose.model("Instructor", instructorSchema);
const Course = mongoose.model("Course", courseSchema);
const Exam = mongoose.model("Exam", examSchema);
const Student = mongoose.model("Student", studentSchema);

module.exports = { Instructor, Course, Exam, Student };
