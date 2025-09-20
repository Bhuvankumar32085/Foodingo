import User from "../models/user.model.js";

export const getCurrUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User Found.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "get current user error.",
    });
  }
};

export const addAndEditLocation = async (req, res) => {
  try {
    const { city, address, state, district } = req.body;
    let user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found.",
      });
    }

    if (!city || !address || !state || !district) {
      return res.status(400).json({
        success: false,
        message: "All field (city, address, state, district) is required.",
      });
    }

    if (city) user.city = city;
    if (address) user.address = address;
    if (state) user.state = state;
    if (district) user.district = district;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Add Location Successfully.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Add Location Error.",
    });
  }
};

export const updateUserLocation = async (req, res) => {
  try {
    const { lat, lon } = req.body;
    const { userId } = req;

    // Validation
    if (typeof lat !== "number" || typeof lon !== "number") {
      return res.status(400).json({
        success: false,
        message: "Lat/Lon must be numbers",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        location: {
          type: "Point",
          coordinates: [lon, lat], // longitude pehle
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "update Location.",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "update Location Error.",
    });
  }
};


