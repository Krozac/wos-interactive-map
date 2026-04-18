import axios from "axios";
import crypto from "crypto";
import FormData from "form-data";
import User from "../models/User.js";
import { createJob, updateJobProgress } from "./jobStore.js";

const WOS_PLAYER_INFO_URL = "https://wos-giftcode-api.centurygame.com/api/player";
const WOS_GIFTCODE_URL = "https://wos-giftcode-api.centurygame.com/api/gift_code";
const WOS_CAPTCHA_URL = "https://wos-giftcode-api.centurygame.com/api/captcha";
const SOLVER_URL = "http://solver:5001/solve"; // instead of localhost
const SECRET = process.env.SECRET || "tB87#kPtkxqOS2";

console.log(SOLVER_URL)

function encodeData(data) {
  const sortedKeys = Object.keys(data).sort();
  const encoded = sortedKeys.map(k => `${k}=${data[k]}`).join("&");
  const sign = crypto.createHash("md5").update(encoded + SECRET).digest("hex");
  return { sign, ...data };
}

async function redeemGiftCodeForUser(fid, rawGiftcode) {
  try {

    const giftcode = rawGiftcode.trim(); 
    // 1. Login
    const loginPayload = encodeData({ fid, time: Math.floor(Date.now() / 1000) });
    const loginResp = await axios.post(WOS_PLAYER_INFO_URL, new URLSearchParams(loginPayload));

    console.log("login : " ,loginResp.data.msg)

    if (loginResp.data.msg !== "success") {
      return { fid, status: "LOGIN_FAILED" };
    }


    // 2. Fetch captcha
    const captchaPayload = encodeData({ fid, time: Date.now() });
    const captchaResp = await axios.post(WOS_CAPTCHA_URL, new URLSearchParams(captchaPayload));
    const captchaBase64 = captchaResp.data?.data?.img;

   // console.log(captchaResp)
    console.log('captcha img : ok' )
    if (!captchaBase64) return { fid, status: "CAPTCHA_FETCH_ERROR" };

    const base64Data = captchaBase64.replace(/^data:image\/\w+;base64,/, "");

    // 3. Send to Python solver
    const form = new FormData();
    form.append("file", Buffer.from(base64Data, "base64"), "captcha.png");

    const solverResp = await axios.post(SOLVER_URL, form, { headers: form.getHeaders() });
    console.log('solver : ', solverResp.data);
    if (!solverResp.data.success) return { fid, status: "SOLVER_FAILED" };
    const captchaCode = solverResp.data.text;

    console.log("captcha : " ,captchaCode)

    // 4. Redeem
    const redeemPayload = encodeData({
      fid,
      cdk: giftcode,
      captcha_code: captchaCode,
      time: Date.now()
    });
    const redeemResp = await axios.post(WOS_GIFTCODE_URL, new URLSearchParams(redeemPayload));
    console.log("status : " ,redeemResp.data.msg)
    return { fid, status: redeemResp.data.msg, response: redeemResp.data };
  } catch (err) {
    console.error(`Redeem error for ${fid}:`, err.message);
    return { fid, status: "ERROR", error: err.message };
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function redeemWithRetry(fid, giftcode, retries = 50) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await redeemGiftCodeForUser(fid, giftcode);

    // Retry for rate limit OR captcha errors
    if 
      (res.status === "ERROR" ||
      res.status === "CAPTCHA CHECK ERROR." ||  // or match your exact string
      res.status === "CAPTCHA CHECK TOO FREQUENT." ||
      res.status === "SOLVER_FAILED" ||
      res.status === "Sign Error" || 
      res.status === "CAPTCHA EXPIRED."   // optional: retry if solver fails
    ) {
      console.log(`Retrying for ${fid} due to ${res.status} (attempt ${attempt})...`);
      await sleep(attempt * 1000); // exponential backoff
      continue;
    }

    return res; // success or other non-retriable failure
  }

  return { fid, status: "FAILED_AFTER_RETRIES" };
}

export async function redeemForAllUsers(giftcode, jobId = null) {
  const users = await User.find({});
  const results = [];

  for (const user of users) {
    const res = await redeemWithRetry(user.id, giftcode);
    results.push(res);

    // Update job progress if jobId is provided
    if (jobId) {
      updateJobProgress(jobId, res);
    }

    // Small delay to avoid flooding
    await sleep(500);
  }

  return results;
}