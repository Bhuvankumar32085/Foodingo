import { cloudinary, uploadToCloudinary } from "../config/cloudinary.js";
import Item from "../models/items.model.js";
import Shop from "../models/shop.model.js";

export const addItems = async (req, res) => {
  try {
    const { name, category, price, foodType } = req.body;

    if (!name || !category || !price || !foodType) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (name, category, price, foodType).",
      });
    }

    const shopExists = await Shop.findOne({ owner: req.userId });
    if (!shopExists) {
      return res.status(404).json({
        success: false,
        message: "Shop Not Found.",
      });
    }

    const shop = shopExists._id;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required.",
      });
    }
    const result = await uploadToCloudinary(req.file.buffer);
    const image = result.secure_url;
    const imagePublick_id = result.public_id;

    const item = await Item.create({
      name,
      image,
      imagePublick_id,
      shop,
      category,
      price,
      foodType,
    });

    shopExists.items.push(item._id);
    await shopExists.save();

    const populatedShop = await Shop.findById(shopExists._id).populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    return res.status(200).json({
      success: true,
      message: "add Item Successfully.",
      item,
      shop: populatedShop,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Add Items.",
    });
  }
};

export const editItems = async (req, res) => {
  try {
    const { name, category, price, foodType } = req.body;
    const { itemId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "item Not Found.",
      });
    }

    if (name) item.name = name;
    if (category) item.category = category;
    if (price) item.price = price;
    if (foodType) item.foodType = foodType;

    if (req.file) {
      if (item.imagePublick_id)
        await cloudinary.uploader.destroy(item.imagePublick_id);
      const result = await uploadToCloudinary(req.file.buffer);
      item.image = result.secure_url;
      item.imagePublick_id = result.public_id;
    }

    await item.save();

    const shop = await Shop.findOne({ owner: req.userId }).populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    return res.status(200).json({
      success: true,
      message: "edit Item Successfully.",
      item,
      shop,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Edit Items.",
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "item Not Found.",
      });
    }

    if (item.imagePublick_id)
      await cloudinary.uploader.destroy(item.imagePublick_id);

    const shop = await Shop.findOneAndUpdate(
      { owner: req.userId },
      { $pull: { items: item._id } },
      { new: true }
    ).populate("items");

    await Item.findByIdAndDelete(item._id);

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully.",
      shop,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Delete Items.",
    });
  }
};

export const getItemByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId).populate("items");
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop Not Found.",
      });
    }

    return res.status(200).json({
      success: true,
      shopItem: shop?.items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Get Items By Shop.",
    });
  }
};

export const searchItem = async (req, res) => {
  try {
    const { query, city } = req.query;

    if (!query || !city) {
      return res.status(404).json({
        success: false,
        message: "Query / City Not Found.",
      });
    }

    // find shops in city
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");

    if (!shops || shops.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Shops Not Found.",
      });
    }

    const shopIds = shops.map((s) => s._id);

    const items = await Item.find({
      shop: { $in: shopIds },
      $or: [
        //$or ka matlab yato name match ho query se ya category {$regex: new RegExp(,'i')} ye help kare ga query ko match karne me eg(Bhuvan==bhuvan==BHUVAn)
        { name: { $regex: new RegExp(query, "i") } },
        { category: { $regex: new RegExp(query, "i") } },
      ],
    }).populate("shop");

    if (!items || items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Items Not Found.",
      });
    }

    return res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    // console.error("Search Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to Search Items.",
    });
  }
};

export const rating = async (req, res) => {
  try {
    const { itemId, rating } = req.body;

    if (rating > 5 || rating < 1) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found.",
      });
    }

    let newCount = item?.rating?.count + 1;
    let newAvg =
      (item?.rating?.average * item?.rating?.count + rating) / newCount;

    item.rating.average = newAvg;
    item.rating.count = newCount;

    await item.save();

    return res.status(200).json({
      success: true,
      message: "Rating updated successfully.",
      item,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Rating Error.",
      error: error.message,
    });
  }
};
