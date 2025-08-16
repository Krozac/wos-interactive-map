const jobs = {};
const JOB_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

export function createJob(giftcode, totalUsers = 0) {
  const jobId = Date.now().toString();
  jobs[jobId] = {
    status: "pending",
    giftcode,
    startTime: Date.now(),
    completedAt: null,        // store completion timestamp
    totalUsers,
    completedUsers: 0,
    results: [],
  };
  return jobId;
}

export function updateJobProgress(jobId, result) {
  const job = jobs[jobId];
  if (!job) return;

  job.results.push(result);
  job.completedUsers += 1;

  if (job.completedUsers >= job.totalUsers) {
    job.status = "completed";
    job.completedAt = Date.now(); // mark completion time
  }
}

export function getJob(jobId) {
  const job = jobs[jobId];
  if (!job) return null;

  return {
    ...job,
    elapsedTime: job.completedAt
      ? Math.floor((job.completedAt - job.startTime) / 1000)
      : Math.floor((Date.now() - job.startTime) / 1000),
  };
}

export function getAllJobs() {
  const now = Date.now();

  // Remove expired jobs
  for (const [id, job] of Object.entries(jobs)) {
    if (job.completedAt && now - job.completedAt > JOB_TTL) {
      delete jobs[id];
    }
  }

  return Object.entries(jobs).map(([id, job]) => ({
    id,
    ...job,
    elapsedTime: job.completedAt
      ? Math.floor((job.completedAt - job.startTime) / 1000)
      : Math.floor((now - job.startTime) / 1000),
  }));
}
