import express from "express";
import { redeemForAllUsers } from "../services/redeem.js";
import { createJob, updateJobProgress } from "../services/jobStore.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {  // mark async here
  const { giftcode } = req.body;
  if (!giftcode) return res.status(400).json({ success: false, message: "Giftcode required" });

  // fetch users asynchronously
  const users = await User.find({});

  // create job
  const jobId = createJob(giftcode, users.length);

  // run redemption in background
  process.nextTick(async () => {
    try {
      const results = await redeemForAllUsers(giftcode, jobId); // pass jobId
      updateJobProgress(jobId, { results, status: "completed" });
    } catch (err) {
      updateJobProgress(jobId, { error: err.message, status: "failed" });
    }
  });

  res.json({ success: true, jobId, message: "Redemption started" });
});

export default router;
