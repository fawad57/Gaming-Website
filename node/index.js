require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const MemberModel = require("./Models/Members");
const EventsModel = require("./Models/Events");
const EventRegistrationModel = require("./Models/EventRegistration");
const ApplicationModel = require("./Models/Apply_Society");
const TeamsModel = require("./Models/Teams");
const AnnouncementModel = require("./Models/Announcement");
const TaskModel = require("./Models/Tasks");
const nodemailer = require("nodemailer");
const passport = require("passport");
// const cookieSession = require("cookie-session");
const cookieParse = require("cookie-parser");
const session = require("express-session");
const GalleryModel = require("./Models/Gallery");
const multer = require("multer");
const path = require("path");
const archiver = require("archiver");

const RequestedEventsModel = require("./Models/RequestedEvents");
const { Console } = require("console");
const uploadDir = path.join(__dirname, "uploads");

const app = express();
app.use(express.json());
app.use(cors());

let Saveemail, Saverole, Savename;
app.use(cookieParse());

app.use(passport.initialize());

app.get("/download-all", (req, res) => {
  const zip = archiver("zip", {
    zlib: { level: 9 }, // Compression level
  });

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", 'attachment; filename="images.zip"');

  zip.pipe(res);

  // Append files from a directory, putting its contents at the root of archive
  zip.directory(uploadDir, false);

  zip.finalize();
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: " GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(
  session({
    secret: "Fawad",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.session());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect("mongodb://127.0.0.1:27017/Gaming_Society");

const otpStore = {}; // Temporarily store OTPs here.+ Use a more secure method in production.

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post("/apply", async (req, res) => {
  console.log(req.body);
  const newApplication = new ApplicationModel({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    qualification: req.body.qualification,
    category: req.body.category,
    reason: req.body.reason,
  });

  await newApplication.save();
  res.json("Your application has been submitted.");
});

app.post("/tasks", (req, res) => {
  TaskModel.create(req.body).then(() => {
    res.json("Task Added successfully");
  });
});

app.get("/tasks", (req, res) => {
  TaskModel.find({ assignedTo: Saveemail }).then((result) => {
    res.json(result);
  });
});

app.post("/tasks-completed", (req, res) => {
  const { _id } = req.body;
  TaskModel.updateOne({ _id: _id }, { $set: { completed: true } }).then(() => {
    res.json("Task completed");
  });
});

app.get("/announcements", async (req, res) => {
  AnnouncementModel.find()
    .sort({ createdBy: -1 })
    .then((announcements) => {
      res.json(announcements);
    });
});

app.post("/announcements", async (req, res) => {
  const { title, message } = req.body;

  try {
    const newAnnouncement = new AnnouncementModel({
      title: title,
      message: message,
      createdBy: Saveemail,
    });
    await newAnnouncement.save();
    res.status(201).json("Announcement has been Added");
  } catch (err) {
    res.status(500).json({ error: "Failed to create announcement" });
  }
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const newImage = new GalleryModel({
      image: req.file.path,
      name: req.file.originalname,
    });
    await newImage.save();
    res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json("Error uploading file");
  }
});

app.post("/event-registration", async (req, res) => {
  const newReq = new EventRegistrationModel({
    event_id: req.body,
    member_email: Saveemail,
  });
  await newReq.save();
  res.status(200).json(`You're successfully register for this event`);
});

app.post("/reset-password", (req, res) => {
  const { email, password } = req.body;
  MemberModel.updateOne(
    { email: email },
    { $set: { password: password } }
  ).then(() => {
    res.json("Successfully changed");
  });
});

function generateSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

app.post("/forget-password", (req, res) => {
  const { email } = req.body;
  MemberModel.findOne({ email: email }).then((member) => {
    if (!member) {
      res.status(404).json("Incorrect email");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: false,
      auth: {
        user: "i222548@nu.edu.pk",
        pass: "xumxfopvdmmoqddk",
      },
    });

    const code = generateSixDigitCode();
    otpStore[email] = code; // Store OTP against the email.

    const mailOptions = {
      from: "i222548@nu.edu.pk",
      to: email,
      subject: "Reset Password",
      text: `Your OTP is: ${code}`,
      html: `<b>Your OTP is: ${code}</b>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).json("Error sending email");
      } else {
        res.status(200).json("OTP sent successfully");
      }
    });
  });
});

app.post("/delete-event", (req, res) => {
  const { _id } = req.body;
  EventsModel.deleteOne({ _id: _id }).then(() => {
    res.json("Event deleted successfully");
  });
});

app.post("/delete-image", (req, res) => {
  const { _id } = req.body;
  GalleryModel.deleteOne({ _id: _id }).then(() => {
    res.json("Event deleted successfully");
  });
});

app.post("/verify-otp", (req, res) => {
  const { email, code } = req.body;
  if (otpStore[email] && otpStore[email] == code) {
    res.status(200).json("OTP verified successfully");
  } else {
    res.status(400).json("Incorrect OTP");
  }
});

app.get("/get-role", (req, res) => {
  if (Saveemail) {
    return res.json({ email: Saveemail, role: Saverole, name: Savename });
  } else {
    res.json("Invalid");
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  MemberModel.findOne({ email: email }).then((member) => {
    if (member) {
      if (member.password === password) {
        Saveemail = member.email;
        Saverole = member.role;
        Savename = member.name;
        console.log(Saveemail);
        console.log(Saverole);
        res.json("Success");
      } else {
        res.json("The password is incorrect");
      }
    } else {
      res.json("No email existed");
    }
  });
});

app.post("/add-events", upload.single("picture"), (req, res) => {
  const { name, location, description, posted_by } = req.body;
  const picture = req.file ? req.file.path : null;

  const newEvent = new EventsModel({
    name,
    location,
    description,
    posted_by,
    picture,
  });

  newEvent
    .save()
    .then((event) => res.json(event))
    .catch((error) => res.status(500).json({ error: error.message }));
});

app.post("/requested-events", upload.single("picture"), (req, res) => {
  const { name, location, description, posted_by, email } = req.body;
  const picture = req.file ? req.file.path : null;

  const newRequestedEvent = new RequestedEventsModel({
    name,
    location,
    description,
    posted_by,
    picture,
    email,
  });

  newRequestedEvent
    .save()
    .then((event) => res.json(event))
    .catch((error) => res.status(500).json({ error: error.message }));
});

app.get("/requested-events", (req, res) => {
  RequestedEventsModel.find({ status: "Pending" }).then((event) =>
    res.json(event)
  );
});

app.get("/applications", (req, res) => {
  ApplicationModel.find({ status: "Pending" }).then((applications) =>
    res.json(applications)
  );
});

app.get("/teams", (req, res) => {
  TeamsModel.find().then((teams) => res.json(teams));
});

app.get("/applications-history", async (req, res) => {
  try {
    const history = await ApplicationModel.find({
      approve_by: Savename,
      status: { $ne: "Pending" },
    }).sort({ date: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).send("Error fetching history");
  }
});

app.get("/events-history", async (req, res) => {
  try {
    const history = await RequestedEventsModel.find({
      approve_by: Savename,
      status: { $ne: "Pending" },
    }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).send("Error fetching history");
  }
});

app.post("/approve-events", (req, res) => {
  const { _id } = req.body;
  console.log(_id);
  RequestedEventsModel.findById({ _id: _id }).then((event) => {
    if (!event) {
      return res.status(404).json("Event not found");
    } else {
      const newEvent = new EventsModel({
        name: event.name,
        posted_by: event.posted_by,
        location: event.location,
        description: event.description,
        picture: event.picture,
        date: event.date,
      });
      newEvent.save();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: false,
        auth: {
          user: "i222548@nu.edu.pk",
          pass: "xumxfopvdmmoqddk",
        },
      });

      const mailOptions = {
        from: "i222548@nu.edu.pk",
        to: event.email,
        subject: "Event Organization Request Approved!",
        text: `Dear ${event.posted_by},
  

        We are delighted to inform you that your request to organize an event for the Gaming Society has been approved! 🎉

        Your enthusiasm and initiative are highly appreciated, and we are excited to see your event come to life. Here are a few next steps to ensure everything runs smoothly:
        
        1. **Event Details Confirmation**: Please provide any additional details or updates regarding the event.
        2. **Resources and Support**: Let us know if you need any specific resources or support from the society.
        3. **Promotion**: We will help promote your event through our channels. Feel free to share any promotional materials you have.
        
        If you have any questions or need assistance, don't hesitate to reach out to our support team at i222548@nu.edu.pk.
        
        Thank you for your contribution to making our community vibrant and engaging!
        
        Best regards,
        Gaming Society`,
        html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f7f7f7; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #1e272e; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">Event Organization Request Approved!</h1>
        </div>
        <div style="padding: 30px;">
          <p style="margin-top: 0;">Dear ${event.posted_by},</p>
          <p>We are delighted to inform you that your request to organize an event for the Gaming Society has been approved! 🎉</p>
          <p>Your enthusiasm and initiative are highly appreciated, and we are excited to see your event come to life. Here are a few next steps to ensure everything runs smoothly:</p>
          <ol style="padding-left: 20px; margin-top: 0; margin-bottom: 30px;">
            <li style="margin-bottom: 10px;"><strong>Event Details Confirmation:</strong> Please provide any additional details or updates regarding the event.</li>
            <li style="margin-bottom: 10px;"><strong>Resources and Support:</strong> Let us know if you need any specific resources or support from the society.</li>
            <li><strong>Promotion:</strong> We will help promote your event through our channels. Feel free to share any promotional materials you have.</li>
          </ol>
          <p>If you have any questions or need assistance, don't hesitate to reach out to our support team at <a href="mailto:i222548@nu.edu.pk" style="color: #3498db; text-decoration: none;">i222548@nu.edu.pk</a>.</p>
          <p style="margin-top: 40px;">Thank you for your contribution to making our community vibrant and engaging!</p>
          <p style="margin-top: 40px; margin-bottom: 0;">Best regards,<br>Gaming Society</p>
        </div>
        <div style="background-color: #ecf0f1; padding: 20px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 0.9rem;">&copy; 2024 Gaming Society. All rights reserved.</p>
        </div>
      </div>
    </div>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.status(500).json("Error sending email");
        } else {
          RequestedEventsModel.updateOne(
            { _id: _id },
            { $set: { status: "Approved", approve_by: Savename } }
          ).then(() => {
            res.json("Event has been approved");
          });
        }
      });
    }
  });
});

app.post("/applications-approve", async (req, res) => {
  const { _id } = req.body;
  try {
    const application = await ApplicationModel.findById(_id);
    if (!application) {
      return res.status(404).json("Application not found");
    }

    if (application.role === "Member") {
      const team = await TeamsModel.findOne({ name: application.category });
      if (team) {
        team.no_of_members += 1;
        await team.save(); // Ensure the team is updated in the database
      }
    }

    if (application.role === "Head") {
      await TeamsModel.updateOne(
        { name: application.category },
        { $set: { head_name: application.name } }
      );
    }

    if (application.role === "Vice Head") {
      await TeamsModel.updateOne(
        { name: application.category },
        { $set: { vice_head: application.name } }
      );
    }

    MemberModel.updateOne(
      { email: application.email },
      { $set: { role: application.role } }
    ).then(() => {
      ApplicationModel.updateOne(
        { _id: _id },
        { $set: { status: "Approved", approve_by: Savename } }
      ).then(() => {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 465,
          secure: false,
          auth: {
            user: "i222548@nu.edu.pk",
            pass: "xumxfopvdmmoqddk",
          },
        });

        const mailOptions = {
          from: "i222548@nu.edu.pk",
          to: application.email,
          subject: "Welcome to the Gaming Society! 🎮",
          text: `Dear ${application.name},

We are thrilled to inform you that your application to join the Gaming Society has been approved! 🎉

Welcome to our vibrant community of gamers where you can connect, compete, and collaborate with fellow enthusiasts. We are excited to have you on board and can't wait for you to dive into the world of gaming adventures with us.

Here are a few things to get you started:

Upcoming events and tournaments: Stay tuned for announcements on our events page.
Introduce yourself: Feel free to share a bit about yourself in the introduction channel.
If you have any questions or need assistance, don't hesitate to reach out to our support team at 1222548@nu.edu.pk. We're here to help!

Once again, welcome to the Gaming Society. Let's make great memories together!

Best regards,
Gaming Society`,
          html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f7f7f7; padding: 20px;">
      <div style=" margin: auto; background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #1e272e; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">Welcome to the Gaming Society! 🎮</h1>
        </div>
        <div style="padding: 30px;">
          <p style="margin-top: 0;">Dear ${application.name},</p>
          <p>We are thrilled to inform you that your application to join the Gaming Society has been approved! 🎉</p>
          <p>Welcome to our vibrant community of gamers where you can connect, compete, and collaborate with fellow enthusiasts. We are excited to have you on board and can't wait for you to dive into the world of gaming adventures with us.</p>
          <h3 style="color: #3498db; margin-top: 30px; margin-bottom: 10px;">Here are a few things to get you started:</h3>
          <ul style="padding-left: 20px; margin-top: 0; margin-bottom: 30px;">
            <li style="margin-bottom: 10px;"><strong>Upcoming events and tournaments:</strong> Stay tuned for announcements on our events page.</li>
            <li><strong>Introduce yourself:</strong> Feel free to share a bit about yourself in the introduction channel.</li>
          </ul>
          <p>If you have any questions or need assistance, don't hesitate to reach out to our support team at <a href="mailto:i222548@nu.edu.pk" style="color: #3498db; text-decoration: none;">i222548@nu.edu.pk</a>. We're here to help!</p>
          <p style="margin-top: 40px;">Once again, welcome to the Gaming Society. Let's make great memories together!</p>
          <p style="margin-top: 40px; margin-bottom: 0;">Best regards,<br>Gaming Society</p>
        </div>
        <div style="background-color: #ecf0f1; padding: 20px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 0.9rem;">&copy; 2024 Gaming Society. All rights reserved.</p>
        </div>
      </div>
    </div>`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            res.status(500).json("Error sending email");
          } else {
            res.status(200).json("Application approved Successfully");
          }
        });
      });
    });
  } catch (error) {
    console.error("Error in approval process:", error);
    res.status(500).json("An error occurred during the approval process");
  }
});

app.post("/reject-events", (req, res) => {
  const { _id } = req.body;
  RequestedEventsModel.findById({ _id: _id }).then((event) => {
    if (!event) {
      return res.status(404).json("Event not found");
    } else {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: false,
        auth: {
          user: "i222548@nu.edu.pk",
          pass: "xumxfopvdmmoqddk",
        },
      });

      const mailOptions = {
        from: "i222548@nu.edu.pk",
        to: event.email,
        subject: "Event Organization Request Approved!",
        text: `Dear ${event.posted_by},
  

Thank you for your interest in organizing an event for the Gaming Society. We appreciate the effort and enthusiasm you put into your proposal.

After careful consideration, we regret to inform you that your event organization request has not been approved at this time. Our team has to make some tough decisions, and we encourage you not to be discouraged.

We highly value your passion for gaming and your willingness to contribute to our community. Here are a few ways you can still stay involved:

1. **Participate in upcoming events**: Join and enjoy the events organized by other members.
2. **Share your ideas**: Feel free to share your ideas in our suggestion box for future events.
3. **Volunteer**: Help out in organizing and supporting other events.

If you have any questions or would like feedback on your request, feel free to reach out to us at i222548@nu.edu.pk.

Thank you for your understanding and continued support.

Best regards,
Gaming Society`,
        html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f7f7f7; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #1e272e; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">Update on Your Event Organization Request</h1>
        </div>
        <div style="padding: 30px;">
          <p style="margin-top: 0;">Dear ${event.posted_by},</p>
          <p>Thank you for your interest in organizing an event for the Gaming Society. We appreciate the effort and enthusiasm you put into your proposal.</p>
          <p>After careful consideration, we regret to inform you that your event organization request has not been approved at this time. Our team has to make some tough decisions, and we encourage you not to be discouraged.</p>
          <p>We highly value your passion for gaming and your willingness to contribute to our community. Here are a few ways you can still stay involved:</p>
          <ul style="padding-left: 20px; margin-top: 0; margin-bottom: 30px;">
            <li style="margin-bottom: 10px;"><strong>Participate in upcoming events:</strong> Join and enjoy the events organized by other members.</li>
            <li style="margin-bottom: 10px;"><strong>Share your ideas:</strong> Feel free to share your ideas in our suggestion box for future events.</li>
            <li><strong>Volunteer:</strong> Help out in organizing and supporting other events.</li>
          </ul>
          <p>If you have any questions or would like feedback on your request, feel free to reach out to us at <a href="mailto:i222548@nu.edu.pk" style="color: #3498db; text-decoration: none;">i222548@nu.edu.pk</a>.</p>
          <p style="margin-top: 40px;">Thank you for your understanding and continued support.</p>
          <p style="margin-top: 40px; margin-bottom: 0;">Best regards,<br>Gaming Society</p>
        </div>
        <div style="background-color: #ecf0f1; padding: 20px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 0.9rem;">&copy; 2024 Gaming Society. All rights reserved.</p>
        </div>
      </div>
    </div>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.status(500).json("Error sending email");
        } else {
          RequestedEventsModel.updateOne(
            { _id: _id },
            { $set: { status: "Rejected", approve_by: Savename } }
          ).then(() => {
            res.json("Event has been reject");
          });
        }
      });
    }
  });
});
app.post("/applications-rejects", (req, res) => {
  const { _id } = req.body;
  ApplicationModel.findOne({ _id: _id }).then((application) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: false,
      auth: {
        user: "i222548@nu.edu.pk",
        pass: "xumxfopvdmmoqddk",
      },
    });

    const mailOptions = {
      from: "i222548@nu.edu.pk",
      to: application.email,
      subject: "Update on Your Gaming Society Application",
      text: `Dear ${application.name},

Thank you for your interest in joining the Gaming Society. We appreciate the time and effort you put into your application.

After careful consideration, we regret to inform you that your application has not been approved at this time. Our team has to make some tough decisions, and we encourage you not to be discouraged.

We highly value your enthusiasm for gaming and would love to stay connected. Here are a few ways to stay involved with our community:

Follow us on social media: Stay updated with our latest news and events.
Join our public Discord channels: Engage with our community and participate in open discussions.
We hope you'll consider reapplying in the future as we continue to grow and expand. If you have any questions or would like feedback on your application, feel free to reach out to us at i222548@nu.edu.pk.

Thank you again for your interest and understanding.

Best regards,
Gaming Society`,
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f7f7f7; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #1e272e; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">Update on Your Gaming Society Application</h1>
        </div>
        <div style="padding: 30px;">
          <p style="margin-top: 0;">Dear ${application.name},</p>
          <p>Thank you for your interest in joining the Gaming Society. We appreciate the time and effort you put into your application.</p>
          <p>After careful consideration, we regret to inform you that your application has not been approved at this time. Our team has to make some tough decisions, and we encourage you not to be discouraged.</p>
          <p>We highly value your enthusiasm for gaming and would love to stay connected. Here are a few ways to stay involved with our community:</p>
          <ul style="padding-left: 20px; margin-top: 0; margin-bottom: 30px;">
            <li style="margin-bottom: 10px;"><strong>Follow us on social media:</strong> Stay updated with our latest news and events.</li>
            <li><strong>Join our public Discord channels:</strong> Engage with our community and participate in open discussions.</li>
          </ul>
          <p>We hope you'll consider reapplying in the future as we continue to grow and expand. If you have any questions or would like feedback on your application, feel free to reach out to us at <a href="mailto:i222548@nu.edu.pk" style="color: #3498db; text-decoration: none;">i222548@nu.edu.pk</a>.</p>
          <p style="margin-top: 40px;">Thank you again for your interest and understanding.</p>
          <p style="margin-top: 40px; margin-bottom: 0;">Best regards,<br>Gaming Society</p>
        </div>
        <div style="background-color: #ecf0f1; padding: 20px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 0.9rem;">&copy; 2024 Gaming Society. All rights reserved.</p>
        </div>
      </div>
    </div>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).json("Error sending email");
      } else {
        ApplicationModel.updateOne(
          { _id: _id },
          {
            $set: { status: "Rejected", approve_by: Savename },
          }
        ).then(() => {
          res.json("Application reject Successfully");
        });
      }
    });
  });
});

app.post("/signup", (req, res) => {
  const { email } = req.body;
  console.log(email);
  MemberModel.findOne({ email: email }).then((member) => {
    if (member) {
      res.json("Success");
    } else {
      MemberModel.create(req.body)
        .then((members) => res.json(members))
        .catch((err) => res.json(err));
    }
  });
});

app.get("/api-events", async (req, res) => {
  const events = await EventsModel.find();
  res.json(events);
});

app.get("/api-gallery", async (req, res) => {
  const events = await GalleryModel.find();
  res.json(events);
});

app.get("/members", (req, res) => {
  MemberModel.find({ role: "Member", role: "Vice Head" })
    .then((members) => res.json(members))
    .catch((err) => res.json(err));
});

app.post("/logout", (req, res) => {
  Saveemail = "";
  Saverole = "";
  res.json("yes");
});
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
