import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loggedUser: null, //for all
    isLogging: false, //for all
    city: null, //for all
    shop: null, //for owner
    getShopsByCity: null, //for user
    cartItems: [], //for user
    totalAmount: 0, //for user
    myOrders: [], //for user and shop
    searchItems: [], //for user
  },
  reducers: {
    setLoggedUser: (state, action) => {
      state.loggedUser = action.payload;
    },
    setIsLogging: (state, action) => {
      state.isLogging = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setShop: (state, action) => {
      state.shop = action.payload;
    },
    setGetShopsByCity: (state, action) => {
      state.getShopsByCity = action.payload;
    },
    setAddtoCart: (state, action) => {
      const cartItem = action.payload;
      if (!state.cartItems) {
        state.cartItems = [];
      }
      const existing = state.cartItems?.find((i) => i.id == cartItem.id);
      if (existing) {
        existing.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }
      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
    },
    setAddToCartAfterLogout: (state, action) => {
      state.cartItems = action.payload;
    },
    setQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.id == id);
      if (item) {
        item.quantity = quantity;
      }
      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
    },
    setRemoveCartItem: (state, action) => {
      const { id } = action.payload;
      state.cartItems = state.cartItems.filter((i) => i.id != id);
      state.totalAmount = state.cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
    },
    setMyOredrs: (state, action) => {
      state.myOrders = action.payload;
    },
    setMyOredrsPush: (state, action) => {
      state.myOrders.push(action.payload);
    },
    setSearchItems: (state, action) => {
      state.searchItems = action.payload;
    },
    setUpdateStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find((o) => o._id == orderId);
      if (order) {
        if (order.shopOrders && order.shopOrders.shop._id === shopId) {
          order.shopOrders.status = status;
        }
      }
    },
    setUpdateRealTimeOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find((o) => o._id == orderId);
      if (order) {
        const shopOrder = order?.shopOrders?.find((so) => so._id == shopId);
        if (shopOrder) {
          shopOrder.status = status;
        }
      }
    },
  },
});

export const {
  setLoggedUser,
  setIsLogging,
  setCity,
  setMyOredrsPush,
  setShop,
  setGetShopsByCity,
  setAddtoCart,
  setAddToCartAfterLogout,
  setQuantity,
  setRemoveCartItem,
  setMyOredrs,
  setUpdateStatus,
  setSearchItems,
  setUpdateRealTimeOrderStatus,
} = userSlice.actions;
export default userSlice.reducer;
