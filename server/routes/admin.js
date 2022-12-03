const express = require("express");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const sharp = require("sharp");
const aws = require("aws-sdk");
const router = express.Router();

const Message = require("../models/Message");
const Project = require("../models/Project");

const upload = multer({
  dest: "./server/public/uploads",
  fileFilter: (req, image, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(image.mimetype)) {
      const error = new Error("Wrong file type");
      error.code = "LIMIT_FILE_TYPES";
      return cb(error, false);
    }

    cb(null, true);
  },
  limits: {
    fileSize: process.env.MAX_SIZE,
  },
});

router.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.send({ messages: messages });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.post("/projects", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();

    res.send({ project: project, message: "Project added successfully!" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.patch("/projects", async (req, res) => {
  try {
    const s3 = new aws.S3();

    const project = await Project.findOne({ _id: req.body.id });

    if (!project) throw "Project not found";

    const imagesToDelete = project.images.filter(image => !req.body.images.includes(image));

    for (let i = 0; i < imagesToDelete.length; i++) {
      const image = imagesToDelete[i];

      await s3
        .deleteObject({
          Bucket: "bababui-test",
          Key: image.split("/").at(-1),
        })
        .promise();
    }

    project.title = req.body.title;
    project.images = req.body.images;

    await project.save();

    res.send({ project: project, message: "Project updated successfully!" });
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
});

router.delete("/projects/:projectId", async (req, res) => {
  try {
    const s3 = new aws.S3();

    const project = await Project.findOne({ _id: req.params.projectId });

    if (!project) throw "Project not found";

    for (let i = 0; i < project.images.length; i++) {
      const image = project.images[i];

      await s3
        .deleteObject({
          Bucket: "bababui-test",
          Key: image.split("/").at(-1),
        })
        .promise();
    }

    await project.remove();

    res.send({ project: null, message: "Project deleted successfully!" });
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
});

router.post("/upload", upload.array("images"), async (req, res) => {
  const s3 = new aws.S3();

  try {
    const project = await Project.findOne({ _id: req.body.projectId });

    if (!project) throw "Project not found";

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];

      const buffer = await sharp(file.path).toBuffer();

      //   console.log(JSON.stringify(file, null, 2));
      //   console.log("file.originalname");
      //   console.log(file.originalname);
      //   console.log(file.originalname.split("."));
      //   console.log(file.originalname.split(".").pop());
      //   console.log(`Key: ${file.filename}.${file.originalname.split(".").at(-1)}`);

      const s3res = await s3
        .upload({
          Bucket: "bababui-test",
          Key: `${file.filename}.${file.originalname.split(".").pop()}`,
          Body: buffer,
          ACL: "public-read",
        })
        .promise();

      fs.unlink(file.path, () => {
        console.log("removed successfully");
      });

      project.images.push(s3res.Location);
    }

    // req.files.forEach(file => {
    //     const s3res = await s3.upload({
    //         Bucket: 'bababui-test',
    //         Key: 'file.filename',
    //         Body: file,
    //         ACL: 'public-read'
    //     }).promise()

    //     fs.unlink(file.path, () => {
    //         console.log('removed successfully')
    //     })

    //     project.images.push(s3res.Location)
    // })

    await project.save();

    res.send({ project: project, message: "Images uploaded successfully!" });
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
});

router.get("/create-testimonial", async (req, res) => {
  try {
    const token = jwt.sign({ h: req.query.date }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 * 7 });
    res.send({ token: token });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
