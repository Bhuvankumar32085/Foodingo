import dotenv from "dotenv";
dotenv.config();
import { sendDeliveredOtp } from "../config/nodemailer/email.js";
import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import { generateOtp } from "../utils/generateOtp.js";
import Razorpay from "razorpay";

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

export const placeOredr = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;
    if (!cartItems || cartItems.length == 0) {
      return res.status(401).json({
        success: false,
        message: "Cart Items are required.",
      });
    }

    if (
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      return res.status(401).json({
        success: false,
        message: "Address are required.",
      });
    }

    if (!paymentMethod) {
      return res.status(401).json({
        success: false,
        message: "Payment Method are required.",
      });
    }

    const groupItemByShop = {};

    for (let i = 0; i < cartItems.length; i++) {
      const shopId = cartItems[i].shop;

      if (!groupItemByShop[shopId]) {
        groupItemByShop[shopId] = []; // agar key pehli baar aa rahi hai to array banao
      }

      groupItemByShop[shopId].push(cartItems[i]); // item ko array me daal do
    }

    const shopIds = Object.keys(groupItemByShop);
    const shopOrders = await Promise.all(
      shopIds.map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          throw new Error(`Shop with id ${shopId} not found`);
          //   return res.status(404).json({
          //     success: false,
          //     message: "Shop Not Found.",
          //   });
        }
        const items = groupItemByShop[shopId];
        const subtotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        );

        return {
          shop: shop._id,
          shopOrderItem: items.map((i) => ({
            item: i.id,
            price: i.price,
            quantity: i.quantity,
            name: i.name,
          })),
          subtotal,
          owner: shop.owner._id,
        };
      })
    );

    if (paymentMethod === "online") {
      const razorOrder = await instance.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      const order = await Order.create({
        user: req.userId,
        paymentMethod,
        deliveryAddress,
        totalAmount,
        shopOrders,
        razorpayOrderId: razorOrder.id,
        payment: false,
      });

      return res.status(201).json({
        success: true,
        order,
        razorOrder,
        orderId: order._id,
      });
    }

    const createdOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });

    const order = await Order.findById(createdOrder._id)
      .populate("shopOrders.shop", "name")
      .populate("user")
      .populate("shopOrders.shopOrderItem.item", "image name price")
      .populate("shopOrders.assignDeliveryBoy", "fullName mobile")
      .populate("shopOrders")
      .populate("shopOrders.owner", "name socketId");

    const io = req.app.get("io");
    if (io) {
      order.shopOrders.forEach((so) => {
        const ownerSocketId = so?.owner?.socketId;
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("get-cod-order", {
            payment: order.payment,
            deliveryAddress: order.deliveryAddress,
            _id: order._id,
            paymentMethod: order.paymentMethod,
            user: order.user,
            shopOrders: so,
            createdAt: order.createdAt,
          });
        }
      });
    }

    return res.status(201).json({
      success: true,
      message: "Order Placed Successfully.",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Place Oredr.",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpayPaymentId, orderId } = req.body;
    const payment = await instance.payments.fetch(razorpayPaymentId);
    if (!payment || payment.status != "captured") {
      return res.status(400).json({
        success: false,
        message: "Failed to Payment.",
      });
    }

    const order = await Order.findById(orderId)
      .populate("shopOrders.shop", "name")
      .populate("user")
      .populate("shopOrders.shopOrderItem.item", "image name price")
      .populate("shopOrders.assignDeliveryBoy", "fullName mobile")
      .populate("shopOrders")
      .populate("shopOrders.owner", "name socketId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found.",
      });
    }

    order.payment = true;
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();

    const io = req.app.get("io");
    if (io) {
      order.shopOrders.forEach((so) => {
        const ownerSocketId = so?.owner?.socketId;
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("get-cod-order", {
            payment: order.payment,
            deliveryAddress: order.deliveryAddress,
            _id: order._id,
            paymentMethod: order.paymentMethod,
            user: order.user,
            shopOrders: so,
            createdAt: order.createdAt,
          });
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment Successfully.",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify Oredr.",
    });
  }
};

export const getUserOrder = async (req, res) => {
  try {
    const { userId } = req;
    const order = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("shopOrders.shop", "name")
      .populate("shopOrders.owner", "name email mobile")
      .populate("shopOrders.shopOrderItem.item", "image name price");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found.",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Order Get Successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Get User Oredr.",
    });
  }
};

export const getOwnerOrder = async (req, res) => {
  try {
    const { userId } = req;
    const order = await Order.find({ "shopOrders.owner": userId })
      .sort({ createdAt: -1 })
      .populate("shopOrders.shop", "name")
      .populate("user")
      .populate("shopOrders.shopOrderItem.item", "image name price")
      .populate("shopOrders.assignDeliveryBoy", "fullName mobile");

    const filterOrder = order.map((o) => ({
      payment: o.payment,
      deliveryAddress: o.deliveryAddress,
      _id: o._id,
      paymentMethod: o.paymentMethod,
      user: o.user,
      shopOrders: o.shopOrders.find((so) => so.owner == userId),
      createdAt: o.createdAt,
    }));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Order Get Successfully.",
      order: filterOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Get Owner Oredr.",
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status, shopId } = req.body;
    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found.",
      });
    }
    let shopOrder = order.shopOrders.find((s) => s.shop == shopId);
    if (!shopOrder) {
      return res.status(404).json({
        success: false,
        message: "Shop Order Not Found.",
        order,
      });
    }

    shopOrder.status = status;
    await order.populate("shopOrders.shopOrderItem.item", "name image price");

    let deliveryBoyPayload = [];

    if (status == "out of delivery" && !shopOrder.assignment) {
      const { latitude, longitude } = order.deliveryAddress;
      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 5000,
          },
        },
      });

      const nearByIds = nearByDeliveryBoys.map((delivery) => delivery._id);

      const busyDeliveryBoyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["brodcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdsSet = new Set(busyDeliveryBoyIds.map((id) => String(id)));
      const freeDeliveryBoy = nearByDeliveryBoys.filter(
        (b) => !busyIdsSet.has(String(b._id))
      );
      const candidates = freeDeliveryBoy.map((can) => can._id);

      if (candidates.length == 0) {
        await order.save();
        return res.status(401).json({
          success: false,
          message: "Status is updated but there is no delivery boy available.",
        });
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        shop: shopOrder.shop,
        shopOrderId: shopOrder._id,
        brodcastedTo: candidates,
        status: "brodcasted",
      });
      await deliveryAssignment.populate("order"); ///
      await deliveryAssignment.populate("shop"); ///
      shopOrder.assignDeliveryBoy = deliveryAssignment.assignedTo;

      shopOrder.assignment = deliveryAssignment._id;
      deliveryBoyPayload = freeDeliveryBoy.map((b) => ({
        id: b._id,
        name: b.fullName,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
        mobile: b.mobile,
      }));

      const io = req.app.get("io");
      if (io) {
        freeDeliveryBoy.forEach((dBoy) => {
          const dBoySocketId = dBoy.socketId;
          if (dBoySocketId) {
            io.to(dBoySocketId).emit("newAssignment", {
              sentTo: dBoy._id,
              assignmentId: deliveryAssignment?._id,
              orderId: deliveryAssignment?.order?._id,
              shopName: deliveryAssignment?.shop?.name,
              deliveryAddress: deliveryAssignment?.order?.deliveryAddress,
              items:
                deliveryAssignment?.order?.shopOrders?.find((so) =>
                  so._id.equals(deliveryAssignment?.shopOrderId)
                )?.shopOrderItem || [],
              subTotal: deliveryAssignment?.order?.shopOrders?.find((so) =>
                so._id.equals(deliveryAssignment?.shopOrderId)
              )?.subtotal,
            });
          }
        });
      }
    }

    await order.save();
    const updatedShopOrder = order.shopOrders.find((s) => s.shop == shopId);
    await order.populate("shopOrders.shop", "name");
    await order.populate("user");
    await order.populate(
      "shopOrders.assignDeliveryBoy",
      "fullName email mobile"
    );

    const io = req.app.get("io");
    if (io) {
      const userSocketId = order?.user?.socketId;
      if (userSocketId) {
        io.to(userSocketId).emit("update-status", {
          orderId: order._id,
          shopId: updatedShopOrder._id,
          status: updatedShopOrder.status,
          userId: order.user._id,
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: "Update Stutas.",
      shopOrder: updatedShopOrder,
      assignDeliveryBoy: updatedShopOrder?.assignDeliveryBoy, ///
      availableBoys: deliveryBoyPayload,
      assignmentId: updatedShopOrder?.assignment?._id, ///
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update status.",
    });
  }
};

export const getDeliveryBoyAssignment = async (req, res) => {
  try {
    const { userId } = req;
    const deliceryAssignments = await DeliveryAssignment.find({
      brodcastedTo: userId,
      status: "brodcasted",
    })
      .populate("order")
      .populate("shop");

    if (!deliceryAssignments) {
      return res.status(404).json({
        success: false,
        message: "deliceryAssignments not found",
      });
    }

    const formatedData = deliceryAssignments.map((a) => ({
      assignmentId: a._id,
      orderId: a.order?._id,
      shopName: a.shop.name,
      deliveryAddress: a.order?.deliveryAddress,
      items:
        a.order?.shopOrders.find((so) => so._id.equals(a?.shopOrderId))
          ?.shopOrderItem || [],
      subTotal: a.order?.shopOrders.find((so) => so._id.equals(a?.shopOrderId))
        ?.subtotal,
    }));

    return res.status(200).json({
      success: true,
      formatedData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Get Assignment For Delivery Boy.",
    });
  }
};

export const acceptAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await DeliveryAssignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment Not Found.",
      });
    }

    if (assignment.status != "brodcasted") {
      return res.status(401).json({
        success: false,
        message: "Assignment Is Expired.",
      });
    }

    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: { $nin: ["completed", "brodcasted"] },
    });

    if (alreadyAssigned) {
      return res.status(401).json({
        success: false,
        message: "You Are Already Assign To Another Order.",
      });
    }

    assignment.assignedTo = req.userId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    const order = await Order.findById(assignment.order);
    if (!order) {
      return res.status(401).json({
        success: false,
        message: "Order Not Found.",
      });
    }

    const shopOrder = order?.shopOrders.find((so) =>
      so._id.equals(assignment.shopOrderId)
    );
    shopOrder.assignDeliveryBoy = req.userId;

    await order.save();

    return res.status(201).json({
      success: true,
      message: "Assignment Accepted.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Accept Assignment.",
    });
  }
};

export const getCurrentOrder = async (req, res) => {
  try {
    const assignment = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: "assigned",
    })
      .populate("shop", "name")
      .populate("assignedTo", "fullName email mobile location")
      .populate({
        path: "order",
        populate: [
          {
            path: "user",
            select: "fullName email mobile location",
          },
        ],
      });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assingment Not Found.",
      });
    }
    if (!assignment.order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found.",
      });
    }

    const shopOrder = assignment.order.shopOrders.find(
      (so) => String(so._id) == String(assignment.shopOrderId)
    );

    if (!shopOrder) {
      return res.status(404).json({
        success: false,
        message: "ShopOrder Not Found.",
      });
    }

    let deliveryBoyLocation = { lat: null, lon: null };
    if (assignment.assignedTo.location.coordinates.length == 2) {
      deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1];
      deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0];
    }

    let customerBoyLocation = { lat: null, lon: null };
    if (assignment.order.deliveryAddress) {
      customerBoyLocation.lat = assignment.order.deliveryAddress.latitude;
      customerBoyLocation.lon = assignment.order.deliveryAddress.longitude;
    }

    return res.status(200).json({
      success: true,
      _id: assignment.order._id,
      deliveryAddress: assignment.order.deliveryAddress,
      deliveryBoyLocation,
      customerBoyLocation,
      shop: assignment.shop,
      user: assignment.order.user,
      shopOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error to Get Current Order.",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate({
        path: "shopOrders.shop",
        model: "Shop",
      })
      .populate({
        path: "shopOrders.assignDeliveryBoy",
        model: "User",
      })
      .populate({
        path: "shopOrders.shopOrderItem.item",
        model: "Item",
      })
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error to Get Order By Id.",
    });
  }
};

export const sendDeliveredOtpcontroller = async (req, res) => {
  try {
    const { orderId, shopId } = req.body;

    const order = await Order.findById(orderId).populate("user");
    const shopOrder = order.shopOrders.find(
      (so) => String(so._id) == String(shopId)
    );
    if (!order || !shopOrder) {
      return res.status(404).json({
        success: false,
        message: "Provide Valid OrderId/ShopId.",
      });
    }

    const otp = generateOtp();
    shopOrder.deliveryOtp = otp;
    shopOrder.otpExpires = Date.now() + 5 * 60 * 1000;

    await order.save();
    sendDeliveredOtp(order.user.email, otp);

    return res.status(200).json({
      success: true,
      message: "Otp Send To Customer Email.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error to Send Delivered Otp.",
    });
  }
};

export const verifyDeliveredOtpcontroller = async (req, res) => {
  try {
    const { otp, orderId, shopId } = req.body;

    const order = await Order.findById(orderId).populate("user");
    const shopOrder = order.shopOrders.find(
      (so) => String(so._id) == String(shopId)
    );
    if (!order || !shopOrder) {
      return res.status(404).json({
        success: false,
        message: "Provide Valid OrderId/ShopId.",
      });
    }

    if (shopOrder.deliveryOtp != otp) {
      return res.status(401).json({
        success: false,
        message: "Invalide Otp.",
      });
    }

    if (Date.now() > shopOrder.otpExpires) {
      return res.status(401).json({
        success: false,
        message: "Otp Expire.",
      });
    }

    shopOrder.status = "delivered";
    shopOrder.deliverdAt = Date.now();
    shopOrder.deliveryOtp = null;
    shopOrder.otpExpires = null;
    await order.save();

    await DeliveryAssignment.deleteOne({
      shopOrderId: shopOrder._id,
      order: order._id,
      assignedTo: shopOrder.assignDeliveryBoy,
    });

    return res.status(200).json({
      success: true,
      message: "Otp Verified Successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error to Verify Delivered Otp.",
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    const result = await Order.deleteOne({ _id: orderId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the order.",
    });
  }
};

export const getTodayDeliveries = async (req, res) => {
  try {
    const deliverBoyId = req.userId;
    const startOffDay = new Date();
    startOffDay.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      "shopOrders.assignDeliveryBoy": deliverBoyId,
      "shopOrders.status": "delivered",
      "shopOrders.deliverdAt": { $gte: startOffDay },
    }).lean();

    if (!orders) {
      return res.status(404).json({
        success: false,
        message: "Oredr Not Found.",
      });
    }

    let todaysDeliveries = [];

    orders.forEach((order) => {
      order.shopOrders.forEach((so) => {
        if (
          so.assignDeliveryBoy == deliverBoyId &&
          so.status == "delivered" &&
          so.deliverdAt &&
          so.deliverdAt >= startOffDay
        ) {
          todaysDeliveries.push(so);
        }
      });
    });

    let stats = {};

    todaysDeliveries.forEach((so) => {
      const hour = new Date(so.deliverdAt).getHours();
      stats[hour] = (stats[hour] || 0) + 1;
    });

    let formatedData = Object.keys(stats).map((hour) => ({
      hour: parseInt(hour),
      count: stats[hour],
    }));

    formatedData.sort((a, b) => a.hour - b.hour);

    return res.status(200).json({
      success: true,
      message: "Today's deliveries fetched successfully.",
      hourlyStats: formatedData, // 👈 ab chart-friendly
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while geting Today Deliveries.",
    });
  }
};
