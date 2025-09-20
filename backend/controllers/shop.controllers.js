import { cloudinary, uploadToCloudinary } from "../config/cloudinary.js";
import Shop from "../models/shop.model.js";

export const createShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
    if (!name || !city || !state || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (name, city, state, address).",
      });
    }
    const userId = req.userId;

    if (!req.file) {
      return res.status(404).json({
        success: false,
        message: "Image is required.",
      });
    }
    const result = await uploadToCloudinary(req.file.buffer);
    const image = result.secure_url;
    const imagePublick_id = result.public_id;

    const shop = await Shop.create({
      name,
      city,
      state,
      address,
      image,
      imagePublick_id,
      owner: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Shope Created Successfully.",
      shop,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create shop.",
    });
  }
};

export const editShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;

    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop Not Found.",
      });
    }

    if (name) shop.name = name;
    if (city) shop.city = city;
    if (state) shop.state = state;
    if (address) shop.address = address;

    if (req.file) {
      if (shop.imagePublick_id)
        await cloudinary.uploader.destroy(shop.imagePublick_id);
      const result = await uploadToCloudinary(req.file.buffer);
      shop.image = result.secure_url;
      shop.imagePublick_id = result.public_id;
    }

    await shop.save();

    return res.status(200).json({
      success: true,
      message: "Shope Edit Successfully.",
      shop,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to edit shop.",
    });
  }
};

export const getShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.userId })
      .populate("owner")
      .populate({
        path: "items",
        options: { sort: { updatedAt: -1 } },
      });
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop Not Found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Shop Get Successfully.",
      shop,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Get shop.",
    });
  }
};

export const getShopByCity = async (req, res) => {
  try {
    const { city } = req.params;

    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");

    if (!shops || shops.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No shops found in this city.",
      });
    }

    return res.status(200).json({
      success: true,
      shops,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Get shop By City.",
    });
  }
};
