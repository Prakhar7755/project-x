import User from "../models/user.model.js";

const bulkCreateUsers = async (req, res) => {
  try {
    const users = req.body;

    if (!Array.isArray(users)) {
      return res.status(400).json({ message: "Input must be an array" });
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

    if (!Array.isArray(updates)) {
      return res.status(400).json({ message: "Input must be an array" });
    }

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
