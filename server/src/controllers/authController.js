const { Webhook } = require("svix");
const User = require("../models/User");

// Clerk webhook handler for user events
const handleClerkWebhook = async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error("CLERK_WEBHOOK_SECRET is not set");
    }

    const headers = req.headers;
    const payload = req.body; // this is already raw Buffer due to bodyParser.raw

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;

    try {
      evt = wh.verify(payload, headers);
    } catch (err) {
      console.error("❌ Invalid webhook signature:", err.message);
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const {
        id: clerkId,
        email_addresses,
        first_name,
        last_name,
        image_url,
      } = evt.data;

      const user = new User({
        clerkId,
        email: email_addresses[0]?.email_address,
        firstName: first_name || "",
        lastName: last_name || "",
        avatar: image_url || "",
        role: "guest",
      });

      await user.save();
      console.log("✅ User created:", user._id);
    }

    if (eventType === "user.updated") {
      const {
        id: clerkId,
        email_addresses,
        first_name,
        last_name,
        image_url,
      } = evt.data;

      await User.findOneAndUpdate(
        { clerkId },
        {
          email: email_addresses[0]?.email_address,
          firstName: first_name || "",
          lastName: last_name || "",
          avatar: image_url || "",
        }
      );
      console.log("🔄 User updated:", clerkId);
    }

    if (eventType === "user.deleted") {
      const { id: clerkId } = evt.data;
      await User.findOneAndDelete({ clerkId });
      console.log("🗑️ User deleted:", clerkId);
    }

    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("🔥 Webhook error:", error);
    res.status(500).json({ message: "Webhook processing failed" });
  }
};

module.exports = {
  handleClerkWebhook,
};
