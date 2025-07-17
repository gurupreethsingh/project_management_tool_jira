const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");

const attendenceRoutes = require("./routes/AttendanceRoutes");

app.use(cors());

// import the developer routes.
const developerRoutes = require("./routes/developer_routes");

app.use("/api/developers", developerRoutes);
app.use("/api", attendenceRoutes);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(bodyParser.json()); // Parsing JSON bodies
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const User = require("./models/UserModel");
// Import the ContactMessage model
const ContactMessage = require("./models/ContactModel");
// import the blogs model
const Blog = require("./models/BlogModel");
// import the project model
const Project = require("./models/ProjectModel");

// import the subscription model
const Subscription = require("./models/SubscriptionModel");

// import the Scenario model
const Scenario = require("./models/ScenarioModel");

// import the chages model for scenario changes.
const Change = require("./models/ChangeModel");

// import the TestCase model
const TestCase = require("./models/TestCaseModel");

// import the task model
const Task = require("./models/TaskModel");

// import the Bug model.
const Bug = require("./models/BugModel");

// import the bughistory model.
const BugHistory = require("./models/BugHistoryModel");

// import DefectAssignment
const DefectAssignment = require("./models/DefectAssignmentModel");

// import instructor , course, student, exam modules from CourseModel.js file. 
const Student = require("./models/CourseModel");
const Instructor  = require("./models/CourseModel");
const Course  = require("./models/CourseModel");
const Exam = require("./models/CourseModel");

// registering a new user , into the application code is working perfectly fine.
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create a new user
    user = new User({
      name,
      email,
      password,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Login route (with hardcoded JWT secret)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const userToken = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      "ecoders_jwt_secret", // Make sure to use your secret
      { expiresIn: "1h" }
    );

    // Return token and user info
    res.json({
      status: true,
      userToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Fetch user by ID
app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// new upated code.

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const user = await User.findById(req.params.id); // Use req.params.id instead of req.user.id
      let uploadFolder = "uploads/";

      // Dynamically set the upload folder based on the user's role
      if (user && user.role) {
        uploadFolder += user.role;
      } else {
        uploadFolder += "others"; // Fallback folder if no role is found
      }

      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }

      cb(null, uploadFolder);
    } catch (err) {
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.put("/update-user/:id", upload.single("avatar"), async (req, res) => {
  const { name, email, phone, street, city, state, postalCode, country } =
    req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    if (street || city || state || postalCode || country) {
      user.address = user.address || {};
      if (street) user.address.street = street;
      if (city) user.address.city = city;
      if (state) user.address.state = state;
      if (postalCode) user.address.postalCode = postalCode;
      if (country) user.address.country = country;
    }

    // Handle avatar upload
    if (req.file) {
      const uploadFolder = `uploads/${user.role}`;
      const imagePath = `${uploadFolder}/${req.file.filename}`;
      user.avatar = imagePath;
    }

    // Update the updatedAt timestamp
    user.updatedAt = Date.now();

    await user.save();

    res.status(200).json({ msg: "User updated successfully", user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// fetching all the users from the database.
// Fetch all users
app.get("/all-users", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.json(users); // Return the users as a JSON response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// fetch the user by id.
app.get("/get-user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// authenticate the logged in user.
const authenticateToken = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Extract token
      const decoded = jwt.verify(token, "ecoders_jwt_secret"); // Verify token
      req.user = decoded; // Attach user info to the request
      next(); // Proceed to the next middleware
    } catch (err) {
      res.status(403).json({ message: "Invalid token." });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

function requireAdmin(req, res, next) {
  if (req.user && ["admin", "superadmin"].includes(req.user.role)) {
    next(); // User is an admin or superadmin
  } else {
    console.log("Permission denied: User is not an admin or superadmin");
    return res.status(403).json({ error: "Permission denied" });
  }
}

app.delete(
  "/delete-user/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      console.log("User attempting to delete:", req.user);
      const userToDelete = await User.findByIdAndDelete(req.params.id);

      if (!userToDelete) {
        console.log("User not found");
        return res.status(404).json({ error: "User not found" });
      }

      console.log("User deleted successfully");

      if (userToDelete.avatar) {
        const imagePath = path.join(
          __dirname,
          "uploads",
          userToDelete.avatar // Assuming avatar contains the relative path like 'users/filename'
        );

        console.log("Image Path:", imagePath);
        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error("Error deleting image file:", err);
            } else {
              console.log("Image file deleted successfully");
            }
          });
        } else {
          console.error("Image file does not exist:", imagePath);
        }
      }

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
);

// contact routes.
// Route to add a contact message
app.post("/add-contact-message", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message_text, agreeToLicense } =
      req.body;

    if (!email || !firstName || !lastName || !message_text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newContactMessage = new ContactMessage({
      firstName,
      lastName,
      email,
      phone,
      message_text,
      agreeToLicense,
    });

    await newContactMessage.save();
    res
      .status(201)
      .json({ message: "Contact message successfully submitted!" });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({
      error: "An error occurred while submitting the contact message.",
    });
  }
});

// Route to get all contact messages along with their replies (for admin)
app.get("/all-messages", async (req, res) => {
  try {
    // Using .find() to retrieve all messages along with their replies
    const messages = await ContactMessage.find().lean();
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error retrieving contact messages and replies:", error);
    res.status(500).json({
      error:
        "An error occurred while retrieving the contact messages and replies.",
    });
  }
});

// Route to get a single message
app.get("/reply-message/:id", async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.status(200).json(message);
  } catch (error) {
    console.error("Error retrieving message:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the message." });
  }
});

// route to give the reply to the message or question asked from contact page.
app.post("/give-message-reply/:id/reply", async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ error: "Message not found" });

    const newReply = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      timestamp: new Date(),
    };

    message.replies.push(newReply);
    await message.save();

    res.status(200).json({ message: "Reply added successfully", newReply });
  } catch (error) {
    console.error("Error adding reply:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the reply." });
  }
});

// Endpoint to get the count of unread messages
app.get("/messages/unread-count", async (req, res) => {
  try {
    // Query the database for messages that have not been read
    const unreadCount = await ContactMessage.countDocuments({ isRead: false });

    // Return the count of unread messages
    res.json({ unreadCount });
  } catch (error) {
    console.error("Error fetching unread messages count:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Endpoint to mark messages as read
app.post("/messages/mark-as-read", async (req, res) => {
  try {
    const { messageId } = req.body;

    if (!messageId) {
      return res.status(400).json({ error: "Message ID is required" });
    }

    // Use ContactMessage model to update the message status
    const result = await ContactMessage.updateOne(
      { _id: messageId },
      { $set: { isRead: true } } // Update the isRead field to true
    );

    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ error: "Message not found or already marked as read" });
    }

    res.status(200).json({ success: true, message: "Message marked as read" });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// blog routes

const blogstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/blogs";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const blogupload = multer({ storage: blogstorage });

// Route to add a new blog with image upload
app.post("/add-blog", blogupload.single("featuredImage"), async (req, res) => {
  try {
    const {
      title,
      body,
      author,
      summary,
      tags,
      category,
      seoTitle,
      metaDescription,
      published,
    } = req.body;

    // Store only the relative path
    const featuredImage = req.file ? req.file.path.replace(/\\/g, "/") : ""; // Ensure correct slashes

    const newBlog = new Blog({
      title,
      body,
      author,
      summary,
      tags,
      category,
      seoTitle,
      metaDescription,
      published,
      featuredImage, // Store relative path only
      publishedDate: published ? new Date() : null,
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog added successfully", blog: newBlog });
  } catch (error) {
    console.error("Error adding blog:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// route to fetch all teh blogs.
// Route to fetch all blogs
app.get("/all-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().lean(); // Use .lean() for faster queries if you don't need Mongoose documents

    // Modify the featuredImage path to include the server's URL if needed
    const modifiedBlogs = blogs.map((blog) => {
      if (blog.featuredImage) {
        blog.featuredImage = `${req.protocol}://${req.get("host")}/${
          blog.featuredImage
        }`;
      }
      return blog;
    });

    res.status(200).json(modifiedBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Serve static files from the uploads directory
app.use("/uploads", express.static("uploads"));

// Route to fetch a single blog by ID
app.get("/single-blogs/:id", async (req, res) => {
  try {
    const blogId = req.params.id;

    // Fetch the blog based on the ID
    const blog = await Blog.findById(blogId)
      .populate("author", "name")
      .populate("comments.postedBy", "name");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the blog" });
  }
});

//

//

// adding and removing subscription.

// Subscription endpoint to handle new subscriptions
app.post("/api/subscribe", async (req, res) => {
  const { email, subscriptionType } = req.body;

  try {
    let subscription = await Subscription.findOne({ email });

    if (subscription && subscription.isActive) {
      return res.status(400).json({ message: "Email is already subscribed." });
    }

    if (subscription && !subscription.isActive) {
      // Reactivate subscription if previously canceled
      subscription.isActive = true;
      subscription.subscriptionType = subscriptionType;
      subscription.canceledAt = null;
      await subscription.save();
    } else {
      // Create a new subscription
      subscription = new Subscription({
        email,
        subscriptionType,
      });
      await subscription.save();
    }

    res.status(201).json({ message: "Subscription successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//

// fetch all the subscribed users.

// Route to fetch all subscriptions
app.get("/api/all-subscriptions", async (req, res) => {
  try {
    const subscriptions = await Subscription.find({});
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel subscription endpoint
app.post("/api/unsubscribe", async (req, res) => {
  const { email } = req.body;
  try {
    const subscription = await Subscription.findOne({ email });
    if (!subscription || !subscription.isActive) {
      return res
        .status(404)
        .json({ message: "Subscription not found or already canceled." });
    }
    await subscription.cancelSubscription();
    res.status(200).json({ message: "Unsubscribed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// re subscribe.

app.post("/api/resubscribe", async (req, res) => {
  const { email } = req.body;
  try {
    let subscription = await Subscription.findOne({ email });
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found." });
    }
    subscription.isActive = true;
    subscription.canceledAt = null;
    await subscription.save();
    res.status(200).json({ message: "Resubscribed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//
// to get the total subscription count.
app.get("/api/subscription-count", async (req, res) => {
  try {
    const count = await Subscription.countDocuments({ isActive: true });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching subscription count:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// fetch all the developers.
app.get("/users/developers", async (req, res) => {
  try {
    // Fetch users with the role 'developer'
    const developers = await User.find({ role: "developer" });
    res.status(200).json(developers);
  } catch (error) {
    console.error("Error fetching developers:", error);
    res.status(500).json({ message: "Error fetching developers" });
  }
});

// fetch all test engineers.
app.get("/users/test-engineers", async (req, res) => {
  try {
    // Fetch users with the role 'test_engineer'
    const testEngineers = await User.find({ role: "test_engineer" });
    res.status(200).json(testEngineers);
  } catch (error) {
    console.error("Error fetching test engineers:", error);
    res.status(500).json({ message: "Error fetching test engineers" });
  }
});

// Temporarily disabled authenticateToken middleware for project creation
app.post("/create-project", authenticateToken, async (req, res) => {
  try {
    const {
      projectName,
      description,
      startDate,
      endDate,
      deadline,
      developers,
      testEngineers,
    } = req.body;

    // Ensure required fields are provided
    if (!projectName || !startDate || !deadline) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProject = new Project({
      project_name: projectName,
      description,
      startDate,
      endDate: endDate || null, // Set end date to null if not provided
      deadline,
      createdBy: req.user.id, // Use the user ID from the JWT token
      developers,
      testEngineers,
    });

    await newProject.save();
    return res
      .status(201)
      .json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    console.error("Server error during project creation:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// route to fetch all projects.
app.get("/all-projects", async (req, res) => {
  try {
    const { search = "" } = req.query;

    const query = {
      project_name: { $regex: search, $options: "i" }, // Case-insensitive search
    };

    const projects = await Project.find(query)
      .populate("createdBy", "name")
      .populate("developers", "name")
      .populate("testEngineers", "name");

    res.json({
      projects,
      totalCount: projects.length, // Send total number of projects
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Count Projects Route
app.get("/count-projects", async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments(); // Count all projects
    console.log("Total Projects: ", totalProjects); // Log the count to verify
    res.json({ totalProjects }); // Return the count as a JSON object
  } catch (error) {
    console.error("Error fetching project count:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// function to delete a project. by its id.

// DELETE endpoint to delete a project by ID
app.delete("/delete-project/:id", async (req, res) => {
  try {
    const projectId = req.params.id;

    // Check if the project exists before attempting to delete
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete the project
    await Project.findByIdAndDelete(projectId);

    res.status(200).json({ message: "Project has been successfully deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/count-developers", async (req, res) => {
  try {
    const totalDevelopers = await Project.aggregate([
      { $unwind: "$developers" }, // Unwind the developers array
      { $group: { _id: "$developers" } }, // Group by developer ID to get distinct developers
      { $count: "totalDevelopers" }, // Count distinct developers
    ]);

    const developerCount = totalDevelopers[0]?.totalDevelopers || 0; // Safely access the count
    console.log("Total Developers: ", developerCount); // Log the count to verify
    res.json({ totalDevelopers: developerCount }); // Return the count as a JSON object
  } catch (error) {
    console.error("Error fetching developers count:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Count Test Engineers Route
app.get("/count-test-engineers", async (req, res) => {
  try {
    // Count the number of users with the role 'test_engineer'
    const totalTestEngineers = await User.countDocuments({
      role: "test_engineer",
    });

    console.log("Total Test Engineers: ", totalTestEngineers); // Log the count to verify
    res.json({ totalTestEngineers }); // Send the count as a JSON response
  } catch (error) {
    console.error("Error fetching test engineers count:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// count all the admins in this application.
app.get("/count-admins", async (req, res) => {
  try {
    const totalAdmins = await User.countDocuments({ role: "admin" });
    res.json({ totalAdmins });
  } catch (error) {
    console.error("Error fetching admin count:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// count all the accountants.
app.get("/count-accountants", async (req, res) => {
  try {
    const totalAccountants = await User.countDocuments({ role: "accountant" });
    res.json({ totalAccountants });
  } catch (error) {
    console.error("Error fetching accountant count:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//count all alumni
app.get("/count-alumni-relations", async (req, res) => {
  try {
    const totalAlumniRelations = await User.countDocuments({
      role: "alumni_relations",
    });
    res.json({ totalAlumniRelations });
  } catch (error) {
    console.error("Error fetching alumni relations count:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// count all the business analysts.
app.get("/count-business-analysts", async (req, res) => {
  try {
    const totalBusinessAnalysts = await User.countDocuments({
      role: "business_analyst",
    });
    res.json({ totalBusinessAnalysts });
  } catch (error) {
    console.error("Error fetching business analyst count:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// count all content creaters.
app.get("/count-content-creators", async (req, res) => {
  try {
    const totalContentCreators = await User.countDocuments({
      role: "content_creator",
    });
    res.json({ totalContentCreators });
  } catch (error) {
    console.error("Error fetching content creator count:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// count all the customer support.
app.get("/count-customer-support", async (req, res) => {
  try {
    const totalCustomerSupport = await User.countDocuments({
      role: "customer_support",
    });
    res.json({ totalCustomerSupport });
  } catch (error) {
    console.error("Error fetching customer support count:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// count all the data scientists.
app.get("/count-data-scientists", async (req, res) => {
  try {
    const totalDataScientists = await User.countDocuments({
      role: "data_scientist",
    });
    res.json({ totalDataScientists });
  } catch (error) {
    console.error("Error fetching data scientist count:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/count-deans", async (req, res) => {
  try {
    const totalDeans = await User.countDocuments({ role: "dean" });
    res.json({ totalDeans });
  } catch (error) {
    console.error("Error fetching dean count:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//
app.get("/count-department-heads", async (req, res) => {
  try {
    const totalDepartmentHeads = await User.countDocuments({
      role: "department_head",
    });
    res.json({ totalDepartmentHeads });
  } catch (error) {
    console.error("Error fetching department head count:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//event
app.get("/count-event-coordinators", async (req, res) => {
  try {
    const totalEventCoordinators = await User.countDocuments({
      role: "event_coordinator",
    });
    res.json({ totalEventCoordinators });
  } catch (error) {
    console.error("Error fetching event coordinator count:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/count-exam-controllers", async (req, res) => {
  try {
    const totalExamControllers = await User.countDocuments({
      role: "exam_controller",
    });
    res.json({ totalExamControllers });
  } catch (error) {
    console.error("Error fetching exam controller count:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//hr
app.get("/count-hr-managers", async (req, res) => {
  try {
    const totalHRManagers = await User.countDocuments({ role: "hr_manager" });
    res.json({ totalHRManagers });
  } catch (error) {
    console.error("Error fetching HR manager count:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/count-users", async (req, res) => {
  try {
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalSuperAdmins = await User.countDocuments({ role: "superadmin" });
    const totalQALeads = await User.countDocuments({ role: "qa_lead" });
    const totalTestEngineers = await User.countDocuments({
      role: "test_engineer",
    });
    const totalDevelopers = await User.countDocuments({ role: "developer" });

    // Fetch the count of all users, regardless of role
    const totalUsers = await User.countDocuments({});

    res.json({
      totalUsers,
      totalAdmins,
      totalSuperAdmins,
      totalQALeads,
      totalTestEngineers,
      totalDevelopers,
    });
  } catch (error) {
    console.error("Error fetching user counts:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Middleware for JWT-based user authentication (protect routes)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received:", token);

      // Verify token
      const decoded = jwt.verify(token, "ecoders_jwt_secret");

      console.log("Decoded token:", decoded);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next(); // Proceed to next middleware or route handler
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

//fetch the project details based on projectID
app.get("/single-project/:projectId", protect, async (req, res) => {
  const { projectId } = req.params;

  try {
    // Validate project ID before querying the database
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    // Find the project by ID and populate related fields
    const project = await Project.findById(projectId)
      .populate("createdBy", "name") // Populate createdBy with name
      .populate("developers", "name") // Populate developers with name
      .populate("testEngineers", "name") // Populate test engineers with name
      .populate({
        path: "scenarios", // Populate scenarios and test cases
        populate: {
          path: "testCases",
          select: "title description",
        },
      });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Count the total number of scenarios for the project
    const totalScenarios = await Scenario.countDocuments({
      project: projectId,
    });

    // Return both the basic project details and populated fields
    res.json({
      projectName: project.project_name, // Send project_name from the model
      description: project.description, // Send project description
      startDate: project.startDate, // Send project start date
      endDate: project.endDate, // Send project end date
      deadline: project.deadline, // Send project deadline
      domain: project.domain, // Send project domain
      developers: project.developers, // Send populated developers
      testEngineers: project.testEngineers, // Send populated test engineers
      createdBy: project.createdBy, // Send populated createdBy user (QA Lead or Admin)
      scenarios: project.scenarios, // Send populated scenarios with test cases
      totalScenarios, // Include the total scenario count
    });
  } catch (error) {
    console.error("Error fetching project:", error.message);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// Function to generate a unique scenario number based on project name initials and random number
const generateScenarioNumber = (projectName) => {
  const initials = projectName
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join(""); // Extract initials from project name
  const randomNum = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit number
  return `${initials}-${randomNum}`; // Format: PROJECTNAME-1234
};

app.post("/single-projects/:id/add-scenario", protect, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { scenario_text } = req.body;

    // Validate the input
    if (!scenario_text) {
      return res.status(400).json({ error: "Scenario text is required" });
    }

    // Find the project by ID to use the project name for generating the scenario number
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Generate a unique scenario number based on the project name
    const scenario_number = generateScenarioNumber(project.project_name);

    // Create the new scenario
    const scenario = new Scenario({
      scenario_text,
      scenario_number, // Add the generated scenario number here
      project: projectId,
      createdBy: req.user.id, // The user is fetched from the protect middleware
    });

    // Save the scenario
    await scenario.save();

    // Add the scenario to the project
    await Project.findByIdAndUpdate(projectId, {
      $push: { scenarios: scenario._id },
    });

    res.status(201).json({ message: "Scenario added successfully", scenario });
  } catch (error) {
    console.error("Error adding scenario:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new scenario (route adjusted to /single-projects/:id/scenario)
app.put("/single-project/scenario/:scenarioId", protect, async (req, res) => {
  const { scenario_text, userId } = req.body;
  const scenarioId = req.params.scenarioId;

  try {
    const scenario = await Scenario.findById(scenarioId);
    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const change = new Change({
      scenario: scenario._id,
      previous_text: scenario.scenario_text,
      user: user._id,
      time: Date.now(),
    });
    await change.save();

    scenario.scenario_text = scenario_text;
    await scenario.save();

    res.json({ message: "Scenario updated successfully" });
  } catch (error) {
    console.error("Error updating scenario:", error);
    res.status(500).json({ message: "Error updating scenario", error });
  }
});

// Route to fetch all scenarios based on the selected project
app.get("/single-project/:id/view-all-scenarios", async (req, res) => {
  try {
    const { id } = req.params; // Project ID from the route params

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    // Find the project by ID
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Fetch scenarios for the project
    const scenarios = await Scenario.find({ project: id })
      .populate("createdBy", "name") // Populate the 'createdBy' field with user name
      .populate("project", "project_name") // Populate the 'project' field with project name
      .populate("testCases", "title description"); // Populate the 'testCases' field with test case details

    // Check if there are scenarios
    if (!scenarios || scenarios.length === 0) {
      return res
        .status(404)
        .json({ message: "No scenarios found for this project" });
    }

    // Return the fetched scenarios
    res.json(scenarios);
  } catch (error) {
    console.error("Error fetching scenarios:", error.message);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Route to get a single scenario and its change history
app.get(
  "/single-project/:projectId/scenario-history/:scenarioId",
  async (req, res) => {
    const scenarioId = req.params.scenarioId;

    try {
      // Fetch the scenario details
      const scenario = await Scenario.findById(scenarioId).populate(
        "createdBy project"
      );

      if (!scenario) {
        return res.status(404).json({ message: "Scenario not found" });
      }

      // Fetch all the changes related to the scenario and populate user details
      const changes = await Change.find({ scenario: scenarioId })
        .populate("user") // Populate the user who made the change
        .sort({ time: -1 });

      res.json({ scenario, changes });
    } catch (error) {
      console.error("Error fetching scenario details:", error); // Log the error to debug
      res
        .status(500)
        .json({ message: "Error fetching scenario details", error });
    }
  }
);

//fetching scenario by id.
app.put(
  "/single-project/scenario/:scenarioId",
  authenticateToken,
  async (req, res) => {
    const { scenario_text, userId } = req.body;
    const scenarioId = req.params.scenarioId;

    try {
      const scenario = await Scenario.findById(scenarioId);
      if (!scenario) {
        return res.status(404).json({ message: "Scenario not found" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const change = new Change({
        scenario: scenario._id,
        previous_text: scenario.scenario_text,
        user: user._id,
        time: Date.now(),
      });
      await change.save();

      scenario.scenario_text = scenario_text;
      await scenario.save();

      res.json({ message: "Scenario updated successfully" });
    } catch (error) {
      console.error("Error updating scenario:", error);
      res.status(500).json({ message: "Error updating scenario", error });
    }
  }
);

// deleting the scenario by id. with all the history text.
app.delete(
  "/single-project/scenario/:scenarioId",
  protect, // Ensure this middleware is used to protect the route
  async (req, res) => {
    try {
      const scenarioId = req.params.scenarioId;

      // Delete the scenario
      const scenario = await Scenario.findByIdAndDelete(scenarioId);
      if (!scenario) {
        return res.status(404).json({ message: "Scenario not found" });
      }

      // Delete all change history related to the scenario
      await Change.deleteMany({ scenario: scenarioId });

      res
        .status(200)
        .json({ message: "Scenario and its history deleted successfully" });
    } catch (error) {
      console.error("Error deleting scenario:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// fetching only scenario number from scenario based on id.
app.get(
  "/single-project/scenario/:scenarioId/scenario-number",
  protect, // Ensure this middleware is applied
  async (req, res) => {
    const { scenarioId } = req.params;

    console.log("Request received for scenario ID:", scenarioId); // Check if the request reaches the server

    try {
      const scenario = await Scenario.findById(scenarioId);

      if (!scenario) {
        console.log("Scenario not found for ID:", scenarioId); // Log if the scenario is not found
        return res.status(404).json({ message: "Scenario not found" });
      }

      console.log("Scenario found:", scenario); // Log the found scenario

      res.json({
        scenarioNumber: scenario.scenario_number,
      });
    } catch (error) {
      console.error("Error fetching scenario number:", error);
      res
        .status(500)
        .json({ message: "Error fetching scenario number", error });
    }
  }
);

// Route to get all admins  of the application.
app.get("/all-admins", async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all developers
app.get("/all-developers", async (req, res) => {
  try {
    const developers = await User.find({ role: "developer" }); // Fetch only developers
    res.status(200).json(developers);
  } catch (error) {
    console.error("Error fetching developers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all test engineers
app.get("/all-test-engineers", async (req, res) => {
  try {
    const testEngineers = await User.find({ role: "test_engineer" }); // Fetch only test engineers
    res.status(200).json(testEngineers);
  } catch (error) {
    console.error("Error fetching test engineers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to add a new test case
app.post("/add-test-case", async (req, res) => {
  const {
    project_id,
    project_name,
    scenario_id,
    scenario_number,
    test_case_name,
    requirement_number,
    build_name_or_number,
    module_name,
    pre_condition,
    test_data,
    post_condition,
    severity,
    test_case_type,
    brief_description,
    test_execution_time,
    testing_steps,
    footer,
  } = req.body;

  try {
    // Create a new test case
    const newTestCase = new TestCase({
      project_id,
      project_name,
      scenario_id,
      scenario_number,
      test_case_name,
      requirement_number,
      build_name_or_number,
      module_name,
      pre_condition,
      test_data,
      post_condition,
      severity,
      test_case_type,
      brief_description,
      test_execution_time,
      testing_steps,
      footer,
    });

    // Save the test case to the database
    await newTestCase.save();

    // Respond with success
    res.status(201).json({
      message: "Test case created successfully",
      testCase: newTestCase,
    });
  } catch (error) {
    console.error("Error creating test case:", error);
    res.status(500).json({ message: "Error creating test case", error });
  }
});

// fetcing all the test cases from the database.
// Route to fetch all test cases
app.get("/all-test-cases", async (req, res) => {
  try {
    const testCases = await TestCase.find(); // Fetch all test cases
    res.json(testCases); // Return the test cases as a JSON response
  } catch (error) {
    console.error("Error fetching test cases:", error);
    res.status(500).json({ message: "Error fetching test cases" });
  }
});

// fetching all the test cases based on the project id. passed .
app.get("/single-project/:projectId/all-test-cases", async (req, res) => {
  const { projectId } = req.params;
  try {
    const testCases = await TestCase.find({ project_id: projectId });
    res.json(testCases);
  } catch (error) {
    console.error("Error fetching test cases:", error);
    res.status(500).json({ message: "Error fetching test cases" });
  }
});

// delete test case by id.
// Route to delete a test case by its ID
app.delete("/delete-test-case/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await TestCase.findByIdAndDelete(id); // Find and delete the test case by its ID
    res.json({ message: "Test case deleted successfully" });
  } catch (error) {
    console.error("Error deleting test case:", error);
    res.status(500).json({ message: "Error deleting test case" });
  }
});

// fetch test case by id.

// Route to fetch a single test case by ID
app.get("/get-test-case/:id", async (req, res) => {
  try {
    const testCase = await TestCase.findById(req.params.id);
    if (!testCase) {
      return res.status(404).json({ message: "Test case not found" });
    }
    res.json(testCase);
  } catch (error) {
    console.error("Error fetching test case:", error);
    res.status(500).json({ message: "Error fetching test case", error });
  }
});

// update the test case based on id.

// Route to update a test case by ID
app.put("/update-test-case/:id", async (req, res) => {
  const {
    test_case_name,
    requirement_number,
    build_name_or_number,
    module_name,
    pre_condition,
    test_data,
    post_condition,
    severity,
    test_case_type,
    brief_description,
    test_execution_time,
    testing_steps,
    footer,
  } = req.body;

  try {
    // Find the test case by ID and update it
    const updatedTestCase = await TestCase.findByIdAndUpdate(
      req.params.id,
      {
        test_case_name,
        requirement_number,
        build_name_or_number,
        module_name,
        pre_condition,
        test_data,
        post_condition,
        severity,
        test_case_type,
        brief_description,
        test_execution_time,
        testing_steps,
        footer,
      },
      { new: true } // Return the updated document
    );

    if (!updatedTestCase) {
      return res.status(404).json({ message: "Test case not found" });
    }

    res.status(200).json({
      message: "Test case updated successfully",
      testCase: updatedTestCase,
    });
  } catch (error) {
    console.error("Error updating test case:", error);
    res.status(500).json({ message: "Error updating test case", error });
  }
});

// In your backend, create an API route to return the total test case count for a project
app.get("/projects/:projectId/test-cases-count", async (req, res) => {
  const { projectId } = req.params;
  try {
    const totalTestCases = await TestCase.countDocuments({
      project_id: projectId,
    });
    res.json({ totalTestCases });
  } catch (error) {
    res.status(500).send("Error fetching test case count");
  }
});

// GET all scenarios for a specific project using app.get
app.get("/projects/:projectId/scenarios", async (req, res) => {
  const { projectId } = req.params;

  try {
    // Find the project by its ID
    const project = await Project.findById(projectId).populate("scenarios");

    // If the project is not found, return an error
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Find all scenarios associated with the project
    const scenarios = await Scenario.find({ project: projectId });

    // If no scenarios are found, return an empty array
    if (!scenarios || scenarios.length === 0) {
      return res.json([]);
    }

    // Return the scenario numbers and texts
    const response = scenarios.map((scenario) => ({
      _id: scenario._id,
      scenario_number: scenario.scenario_number,
      scenario_text: scenario.scenario_text,
    }));

    // Send the response
    res.json(response);
  } catch (error) {
    console.error("Error fetching scenarios:", error);
    res.status(500).json({ message: "Error fetching scenarios" });
  }
});

//
// Fetch all users (developers, test engineers, and the project creator) of a specific project by projectId
app.get("/projects/:projectId/users", async (req, res) => {
  const { projectId } = req.params;

  try {
    // Find the project by its ID and populate the 'developers', 'testEngineers', and 'createdBy' fields with user details
    const project = await Project.findById(projectId)
      .populate("developers", "name email role") // Populate developers with specific fields
      .populate("testEngineers", "name email role") // Populate test engineers with specific fields
      .populate("createdBy", "name email role"); // Populate the project creator (QA lead) with specific fields

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Combine all the users into a single array
    const allUsers = [
      { role: "Project Creator", user: project.createdBy },
      ...project.developers.map((user) => ({ role: "Developer", user })),
      ...project.testEngineers.map((user) => ({ role: "Test Engineer", user })),
    ];

    // Respond with the list of users
    res.json({ users: allUsers });
  } catch (error) {
    console.error("Error fetching project users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Traceability Matrix API
app.get("/projects/:projectId/traceability-matrix", async (req, res) => {
  const { projectId } = req.params;

  try {
    // Fetch all scenarios for the given project
    const scenarios = await Scenario.find({ project: projectId });

    // Fetch all test cases for the given project
    const testCases = await TestCase.find({ project_id: projectId });

    // Fetch all bugs for the given project
    const bugs = await Bug.find({ project_id: projectId });

    // Helper function to determine test case status
    const getTestCaseStatus = (testSteps) => {
      if (!testSteps || testSteps.length === 0) {
        return "N/A"; // No steps to evaluate
      }
      const failedSteps = testSteps.filter((step) => step.status === "Fail");
      return failedSteps.length > 0 ? "Fail" : "Pass";
    };

    // Map scenarios to their test case, or mark them as missing if no match is found
    const matrix = scenarios.map((scenario) => {
      // Find the matched test case
      const matchedTestCase = testCases.find(
        (testCase) =>
          testCase.scenario_id &&
          scenario._id &&
          testCase.scenario_id.toString() === scenario._id.toString()
      );

      // Check for the defect related to the failed test case
      const defect = matchedTestCase
        ? bugs.find(
            (bug) =>
              bug.test_case_number &&
              matchedTestCase.test_case_number &&
              bug.test_case_number.toString() ===
                matchedTestCase.test_case_number.toString()
          )
        : null;

      return {
        scenarioNumber: scenario.scenario_number,
        scenarioText: scenario.scenario_text,
        testCaseNumber: matchedTestCase
          ? matchedTestCase.test_case_number
          : "Missing",
        testCaseStatus: matchedTestCase
          ? getTestCaseStatus(matchedTestCase.testing_steps)
          : "N/A", // Mark as N/A if no test case is found
        defectNumber: defect ? defect.bug_id : "N/A", // Defect number if available
        defectReportStatus:
          matchedTestCase &&
          getTestCaseStatus(matchedTestCase.testing_steps) === "Fail"
            ? defect
              ? "Present"
              : "Missing"
            : "N/A", // Only show for failed test cases
        isMissingTestCases: !matchedTestCase, // Mark as missing if no test case
      };
    });

    res.json(matrix); // Send the matrix data as a response
  } catch (error) {
    console.error("Error fetching traceability matrix:", error.message);
    res.status(500).send("Error fetching traceability matrix");
  }
});

// assign task to users(qa to test engg's).
// Add notification count to user schema
const userSchema = new mongoose.Schema({
  name: String,
  role: String,
  notifications: { type: Number, default: 0 },
});

// Notify the user when a task is assigned

app.post("/projects/:projectId/assign-task", async (req, res) => {
  const { projectId } = req.params;
  const {
    assignedTo,
    title,
    description,
    startDate,
    deadline,
    priority,
    createdBy,
  } = req.body; // Include `createdBy` in the destructuring

  try {
    // Create a new task with the history recording who created the task
    const task = new Task({
      title,
      description,
      project: projectId,
      assignedUsers: [assignedTo],
      startDate,
      deadline,
      priority,
      status: "new",
      history: [
        {
          statusChanges: [
            {
              status: "new",
              changedAt: new Date(),
              changedBy: createdBy, // Use `createdBy` field for tracking who created the task
            },
          ],
        },
      ],
    });

    await task.save();

    // Optionally, notify the assigned user
    await User.findByIdAndUpdate(assignedTo, { $inc: { notifications: 1 } });

    res.status(201).json({ message: "Task successfully assigned.", task });
  } catch (error) {
    console.error("Error assigning task:", error);
    res.status(500).json({ error: "Failed to assign task." });
  }
});

// logic to fetch all the test enginners associated with the project.
app.get("/projects/:projectId/test-engineers", async (req, res) => {
  const { projectId } = req.params;
  try {
    // Find the project by its ID and populate the testEngineers field
    const project = await Project.findById(projectId).populate("testEngineers");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Respond with the test engineers associated with the project
    res.json({ testEngineers: project.testEngineers });
  } catch (error) {
    console.error("Error fetching test engineers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/projects/:projectId/developers", async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findById(projectId).populate("developers");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ developers: project.developers });
  } catch (error) {
    console.error("Error fetching developers:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// fetch all the tasks,
// Backend: Fetch tasks for a project
app.get("/single-project/:projectId/view-all-tasks", async (req, res) => {
  const { projectId } = req.params;

  try {
    // Find tasks related to this project
    const tasks = await Task.find({ project: projectId }).populate(
      "assignedUsers"
    );
    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks." });
  }
});



// route to fetch all the tasks of the developer lead. 
// GET: All tasks assigned to a developer across all projects
app.get("/developer-lead/:userId/assigned-tasks", async (req, res) => {
  const { userId } = req.params;

  try {
    const assignedTasks = await Task.find({
      assignedUsers: { $in: [userId] }
    });

    res.status(200).json({ tasks: assignedTasks });
  } catch (error) {
    console.error("Error fetching developer tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks assigned to developer" });
  }
});

// fetching one task details based on the taskid.
app.get("/single-project/:projectId/single-task/:taskId", async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId).populate({
      path: "history.statusChanges.changedBy",
      select: "name",
    });

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    res.send({ task });
  } catch (error) {
    console.error("Error retrieving task:", error);
    res.status(500).send({ error: "Failed to retrieve task." });
  }
});

// updating the task status.

app.put("/tasks/:taskId/update", async (req, res) => {
  const { taskId } = req.params;
  const { status, deadline, assignedUsers, role, userId } = req.body; // Capture userId from the request

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Prevent updates if the task is closed
    if (task.status === "closed") {
      return res
        .status(400)
        .json({ message: "Task is already closed and cannot be modified." });
    }

    // Role-based logic for updating fields
    if (["admin", "superadmin", "qa_lead"].includes(role)) {
      if (status) task.status = status;
      if (deadline) task.deadline = deadline;
      if (assignedUsers) task.assignedUsers = assignedUsers;
    } else if (["test_engineer", "developer"].includes(role)) {
      if (status) task.status = status;
    } else {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update history
    task.history[0].statusChanges.push({
      status: status || task.status, // Use new status or existing
      changedAt: new Date(),
      changedBy: userId, // Capture the ID of the user making the change
    });

    await task.save();

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get project name by its id.
app.get("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract the project ID from the URL
    const project = await Project.findById(id)
      .populate("createdBy", "name") // Populate the createdBy field with user name
      .populate("developers", "name") // Populate developers with their names
      .populate("testEngineers", "name") // Populate test engineers with their names
      .populate("scenarios"); // Populate the scenarios

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      project_name: project.project_name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      deadline: project.deadline,
      domain: project.domain,
      createdBy: project.createdBy,
      developers: project.developers,
      testEngineers: project.testEngineers,
      scenarios: project.scenarios,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// fetch only those test cases which are fail,
app.get("/projects/:id/test-cases", async (req, res) => {
  try {
    const { id } = req.params;
    const testCases = await TestCase.find({ project_id: id });

    if (testCases.length === 0) {
      return res
        .status(404)
        .json({ message: "No test cases found for this project" });
    }

    // Filter test cases where at least one testing step has a status of "Fail"
    const failedTestCases = testCases.filter((testCase) =>
      testCase.testing_steps.some((step) => step.status === "Fail")
    );

    if (failedTestCases.length === 0) {
      return res
        .status(404)
        .json({ message: "No failed test cases found for this project" });
    }

    // Log the filtered test cases to ensure correctness
    console.log("Failed Test Cases:", failedTestCases);

    // Enrich the test cases with the expected result from the first step
    const enrichedTestCases = failedTestCases.map((testCase) => ({
      ...testCase._doc,
      expected_result: testCase.testing_steps[0]?.expected_result || "N/A",
    }));

    res.json(enrichedTestCases); // Send the filtered and enriched test cases
  } catch (error) {
    console.error("Error fetching test cases:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// adding a new bug with history.

// show only those test case numbers which are failed.
// Assuming you have a Project model and Defect model
app.get("/projects/:projectId/defects", async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Assuming the defect model has a field `project_id` that links to the project
    const defects = await Defect.find({ project_id: projectId });

    if (!defects) {
      return res
        .status(404)
        .json({ message: "No defects found for this project" });
    }

    res.json(defects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET all defects assigned to a developer (Developer Lead) across all project

app.get("/developer-lead/:userId/assigned-defects", async (req, res) => {
  const { userId } = req.params;

  try {
    const assignedDefects = await DefectAssignment.find({
      assignedTo: new mongoose.Types.ObjectId(userId),
    });

    res.status(200).json({ defects: assignedDefects });
  } catch (error) {
    console.error("Error fetching assigned defects:", error);
    res.status(500).json({ error: "Failed to fetch assigned defects" });
  }
});


//

// Route to add a new bug to the database
// Set storage engine and destination for multer
const bugstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/bugs";
    // Check if directory exists, create it if it doesn't
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

// Initialize upload middleware
const bugupload = multer({ storage: bugstorage });

app.post("/addbug", bugupload.single("bug_picture"), async (req, res) => {
  try {
    // Create a new bug object with all required fields
    const newBug = new Bug({
      project_id: req.body.project_id,
      project_name: req.body.project_name,
      scenario_number: req.body.scenario_number,
      test_case_number: req.body.test_case_number,
      test_case_name: req.body.test_case_name,
      bug_id: req.body.bug_id, // Store the bug_id passed from frontend
      requirement_number: req.body.requirement_number,
      build_number: req.body.build_number,
      module_name: req.body.module_name,
      test_case_type: req.body.test_case_type,
      expected_result: req.body.expected_result,
      actual_result: req.body.actual_result,
      description_of_defect: req.body.description_of_defect,
      priority: req.body.priority,
      severity: req.body.severity,
      status: req.body.status || "Open/New",
      steps_to_replicate: req.body.steps_to_replicate
        ? JSON.parse(req.body.steps_to_replicate)
        : [], // Initialize to empty array if not provided
      author: req.body.author,
      reported_date: req.body.reported_date,
      updated_date: new Date(),
      bug_picture: req.file ? req.file.path : "", // File path
      history: [], // Initialize an empty history array
    });

    // Add initial history entry to the history array
    newBug.history.push({
      defect_id: newBug.bug_id, // Add the bug_id or defect_id here
      updated_by: req.body.author,
      status: req.body.status || "Open/New",
      change_description: "Bug created",
      test_case_number: req.body.test_case_number,
      scenario_number: req.body.scenario_number,
      project_name: req.body.project_name,
      previous_status: null,
      updated_at: new Date(), // Track when the status was assigned/changed
    });

    // Save the bug to the database
    await newBug.save();

    res.status(201).json({ message: "Bug added successfully", bug: newBug });
  } catch (error) {
    console.error("Error adding bug:", error);

    // If the image file was uploaded but an error occurred, delete the file
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Error deleting uploaded file:", err);
      }
    }

    res.status(500).json({
      message: "Error adding bug",
      error: error.message,
      stack: error.stack, // Add stack trace for debugging
    });
  }
});

// showing all the defects.
app.get("/single-project/:projectId/all-defects", async (req, res) => {
  const { projectId } = req.params;
  try {
    // Log the project ID to ensure it's correctly passed
    console.log("Fetching defects for project ID:", projectId);

    const defects = await Bug.find({ project_id: projectId });

    // Log the fetched defects to ensure they are being retrieved from the DB
    console.log("Fetched defects:", defects);

    res.status(200).json(defects);
  } catch (error) {
    console.error("Error fetching defects:", error);
    res.status(500).json({ message: "Error fetching defects" });
  }
});

// Route to fetch total defects count for a specific project
app.get("/single-project/:projectId/defects-count", async (req, res) => {
  const { projectId } = req.params;

  try {
    // Ensure projectId is converted to an ObjectId correctly using 'new'
    const projectObjectId = new mongoose.Types.ObjectId(projectId);

    // Fetch the total number of defects related to the projectId
    const defectsCount = await Bug.countDocuments({
      project_id: projectObjectId,
    });

    // Return the count to the client
    res.status(200).json({ totalDefects: defectsCount });
  } catch (error) {
    console.error("Error fetching defects count:", error);
    res.status(500).json({ message: "Error fetching defects count" });
  }
});

//

// get defect by id.

app.get("/single-project/:projectId/defect/:defectId", async (req, res) => {
  const { projectId, defectId } = req.params;

  try {
    // Fetch defect by defectId and projectId
    const defect = await Bug.findOne({ _id: defectId, project_id: projectId });

    if (!defect) {
      console.log("Defect not found.");
      return res.status(404).json({ message: "Defect not found" });
    }

    // Log the defect data for debugging
    console.log("Fetched Defect:", defect);

    // Send the defect details as a response
    res.status(200).json(defect);
  } catch (error) {
    console.error("Error fetching defect by projectId and defectId:", error);
    res.status(500).json({ message: "Error fetching defect" });
  }
});

// Route to delete a bug and its associated image
app.delete("/deletebug/:id", async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    // Delete the bug picture if it exists
    if (bug.bug_picture) {
      const filePath = path.join(__dirname, "..", bug.bug_picture);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
      }
    }

    // Remove the bug from the database
    await Bug.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ message: "Bug and associated picture deleted successfully." });
  } catch (error) {
    console.error("Error deleting bug:", error);
    res.status(500).json({ message: "Error deleting bug", error });
  }
});

// update the bug status.
app.put("/single-project/:projectId/defect/:defectId", async (req, res) => {
  const { projectId, defectId } = req.params;
  const { status, updated_by } = req.body;

  try {
    // Find the bug to update
    const bug = await Bug.findById(defectId);

    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    const previousStatus = bug.status;

    // Update the bug status
    bug.status = status;
    bug.updated_date = Date.now();

    if (status === "Fixed") {
      bug.fixed_date = Date.now();
    }

    // Add the history entry into the bug's history array
    const historyEntry = {
      defect_id: bug._id, // Refer to the bug's ObjectId
      bug_id: bug.bug_id,
      status, // New status
      updated_by, // The user who updated the bug
      previous_status: previousStatus, // Store previous status
      test_case_name: bug.test_case_name, // Store the test case name
      test_case_number: bug.test_case_number, // Store the test case number
      scenario_number: bug.scenario_number, // Store the scenario number
      module_name: bug.module_name, // Store the module name
      change_description: `Status changed from ${previousStatus} to ${status}`, // Description of the change
      updated_at: new Date(), // Store the current time of the update
    };

    // Push the new history entry to the bug's history array
    bug.history.push(historyEntry);

    // Save the updated bug with the new history entry
    await bug.save();

    // Add entry to bug history collection for separate tracking
    const bugHistory = new BugHistory(historyEntry);
    await bugHistory.save();

    res.status(200).json({ message: "Status updated and history saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// backend code to fetch the bug histoy.
app.get(
  "/single-project/:projectId/defect/:defectId/history",
  async (req, res) => {
    const { defectId } = req.params;

    try {
      const history = await BugHistory.find({ defect_id: defectId });
      res.status(200).json(history);
    } catch (error) {
      console.error("Error fetching bug history:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// assign defect to developer route.
app.post("/single-project/:projectId/assign-defect", async (req, res) => {
  const { projectId } = req.params;
  const {
    defectId,
    defectBugId,
    moduleName,
    expectedResult,
    actualResult,
    assignedTo,
    assignedBy, // Now coming from the frontend
  } = req.body;

  try {
    // Create new defect assignment
    const newDefectAssignment = new DefectAssignment({
      projectId,
      projectName: req.body.projectName, // Fetch project name from request body
      moduleName,
      defectId,
      defectBugId,
      expectedResult,
      actualResult,
      assignedTo,
      assignedBy, // Assigning logged-in user from frontend
    });

    // Save the defect assignment in the database
    await newDefectAssignment.save();

    res.status(201).json({
      message: "Defect successfully assigned to the developer!",
      defectAssignment: newDefectAssignment,
    });
  } catch (error) {
    console.error("Error assigning defect:", error);
    res.status(500).json({ message: "Failed to assign defect", error });
  }
});

// funciton to see the assigned defects.
app.get(
  "/single-project/:projectId/developer/:developerId/view-assigned-defects",
  async (req, res) => {
    const { developerId } = req.params;

    try {
      // Find all defects assigned to the developer
      const assignedDefects = await DefectAssignment.find({
        assignedTo: developerId,
      });

      // Return the assigned defects
      res.status(200).json(assignedDefects);
    } catch (error) {
      console.error("Error fetching assigned defects:", error);
      res
        .status(500)
        .json({ message: "Failed to fetch assigned defects", error });
    }
  }
);

// test engineer routes.

// getting the count of projects assinged to the user. based on userID,
app.get("/user-project-count/:userId", async (req, res) => {
  const { userId } = req.params;
  const { role } = req.query; // Get the role from the query string or local storage on the frontend

  try {
    let assignedProjectsCount = 0;

    // Check for the user's role and query the relevant field
    if (role === "test_engineer") {
      // If the user is a test engineer, check if they're in the 'testEngineers' field
      assignedProjectsCount = await Project.countDocuments({
        testEngineers: userId,
      });
    } else if (role === "developer") {
      // If the user is a developer, check if they're in the 'developers' field
      assignedProjectsCount = await Project.countDocuments({
        developers: userId,
      });
    } else if (role === "qa_lead" || role === "admin") {
      // If the user is the project creator (QA lead or admin), check 'createdBy' field
      assignedProjectsCount = await Project.countDocuments({
        createdBy: userId,
      });
    }

    // Return the total count of projects based on the role
    res.json({
      assignedProjectsCount, // Return the count
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching project counts", error });
  }
});

// user assigned projects.

app.get("/user-assigned-projects/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch all projects where the user is either a test engineer, developer, or has any association in the project
    const assignedProjects = await Project.find({
      $or: [
        { testEngineers: userId },
        { developers: userId },
        { createdBy: userId },
        // Add more fields if necessary where the user can be associated (e.g., 'managers', 'reviewers')
      ],
    });

    // Return the assigned projects
    res.json({
      assignedProjects,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching assigned projects", error });
  }
});

// user assigned task,
app.get(
  "/single-project/:projectId/user-assigned-tasks/:userId",
  async (req, res) => {
    try {
      const { projectId, userId } = req.params;

      // Ensure both projectId and userId are valid ObjectId types
      const assignedTasks = await Task.find({
        project: projectId,
        assignedUsers: { $in: [userId] }, // Ensure userId is within the assignedUsers array
      }).populate("assignedUsers", "name");

      // Check if any tasks are found
      if (!assignedTasks.length) {
        return res
          .status(404)
          .json({ message: "No assigned tasks found for this user." });
      }

      res.json({ tasks: assignedTasks });
    } catch (error) {
      console.error("Error fetching assigned tasks:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// connec to mongodb database.
mongoose
  .connect("mongodb://127.0.0.1:27017/ecoders_jira")
  .then(() => {
    console.log("Connected to mongodb.");
  })
  .catch((err) => {
    console.log("Connection to mongo db failed,", err);
  });

const PORT = 5000;

app.listen(PORT, (req, res) => {
  console.log(`Connected to server successfully at port number ${PORT}`);
});
