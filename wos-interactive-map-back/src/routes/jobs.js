import express from "express";
import { getJob, getAllJobs } from "../services/jobStore.js";

const router = express.Router();

// Get a specific job by ID
router.get("/:jobId", (req, res) => {
  const { jobId } = req.params;
  const job = getJob(jobId);
  if (!job) return res.status(404).json({ success: false, message: "Job not found" });

  res.json({ success: true, jobId, status: job.status, results: job.results });
});

// Get all jobs
router.get("/", (req, res) => {
  const jobs = getAllJobs();
  res.json({ success: true, jobs });
});

export default router;
