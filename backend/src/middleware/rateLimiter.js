// NOTE: this won't work since we didn't add keys / token to our .env file
import ratelimit from "../config/upstash.js";


// normally would be rate limit applied per user but since no authentication set up, we can't do it per user yet
// could also rate limit per IP address but he'll keep simple for now with "my-rate-limit"
const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-rate-limit");
    // const {success} = await ratelimit.limit(userid); // if had user authentication
    if (!success) {
      return res
        .status(429)
        .json({ message: "Too many requests. Try again later!" });
    }
    next();
  } catch (error) {
    console.log("Rate limit error ", error);
    next(error);
  }
};

export default rateLimiter;
