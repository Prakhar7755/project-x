import User from "../models/user.model.js";

const bulkCreateUsers = async (req, res) => {
  try {
    const users = req.body;

    // Check for duplicate emails in input
    const emailsInInput = users.map((u) => u.email.toLowerCase());
    const uniqueEmails = new Set(emailsInInput);
    if (emailsInInput.length !== uniqueEmails.size) {
      return res.status(400).json({
        success: false,
        message: "Duplicate emails found in request body",
      });
    }

    // Check if emails already exist in database
    const existingEmails = await User.find(
      { email: { $in: emailsInInput } },
      { email: 1 },
    );

    if (existingEmails.length > 0) {
      const duplicateEmails = existingEmails.map((u) => u.email);
      return res.status(400).json({
        success: false,
        message: "Some emails already exist in database",
        duplicateEmails,
      });
    }

    const result = await User.insertMany(users, {
      ordered: false, // allows partial success
    });

    return res.status(201).json({
      message: "Users inserted successfully",
      insertedCount: result.length,
      data: result,
    });
  } catch (error) {
    return res.status(207).json({
      message: "Partial success / Some records failed",
      error: error.message,
    });
  }
};

const bulkUpdateUsers = async (req, res) => {
  try {
    const updates = req.body;

    const operations = updates.map((user) => ({
      updateOne: {
        filter: { _id: user._id },
        update: {
          $set: {
            ...user,
            updatedAt: new Date(), // ensure update
          },
        },
      },
    }));

    const result = await User.bulkWrite(operations, {
      ordered: false, // partial failure safe
    });

    return res.status(200).json({
      message: "Bulk update completed",
      result,
    });
  } catch (error) {
    return res.status(207).json({
      message: "Partial success / Some updates failed",
      error: error.message,
    });
  }
};

export { bulkCreateUsers, bulkUpdateUsers };
