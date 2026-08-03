const fs = require("fs");
const Resume = require("../models/resume.model");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../service/cloudinary.service");
const { extractTextFromPDF } = require("../service/pdf.service");
const { analyzeResume } = require("../service/gemini.service");

async function uploadResumeController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume.",
      });
    }

    // Extract text from the uploaded PDF
    const extractedText = await extractTextFromPDF(req.file.path);
    const aiResponse = await analyzeResume(extractedText);

    const cleanedResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanedResponse);

    // Upload PDF to Cloudinary
    const cloudinaryResponse = await uploadToCloudinary(req.file.path);

    // Delete local file
    fs.unlinkSync(req.file.path);

    // Save resume in MongoDB
    const resume = await Resume.create({
      user: req.user._id,
      title: req.body.title || "My Resume",

      originalFileName: req.file.originalname,
      fileUrl: cloudinaryResponse.secure_url,
      publicId: cloudinaryResponse.public_id,

      fileSize: req.file.size,
      mimeType: req.file.mimetype,

      extractedText,

      parsedSkills: parsed.skills,
      parsedProjects: parsed.projects,
      parsedExperience: parsed.experience,
      parsedEducation: parsed.education,
      suggestedRoles: parsed.targetRoles,

      // ⭐ Add this line
      aiAnalysis: parsed,
    });

    return res.status(201).json({
      success: true,
      message: "Resume uploaded successfully.",
      resume,
    });
  } catch (error) {
    console.error(error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload resume.",
    });
  }
}

async function getMyResumeController(req, res) {
  try {
    const resume = await Resume.findOne({
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function deleteResumeController(req, res) {
  try {
    const resume = await Resume.findOne({
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    await deleteFromCloudinary(resume.publicId);

    await Resume.findByIdAndDelete(resume._id);

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  uploadResumeController,
  getMyResumeController,
  deleteResumeController,
};
