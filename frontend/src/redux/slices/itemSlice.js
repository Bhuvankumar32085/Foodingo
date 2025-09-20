import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
  name: "item",
  initialState: {
    items: [],
    selectedOwnerItem: null,
  },
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setSelectedOwnerItem: (state, action) => {
      state.selectedOwnerItem = action.payload;
    },
  },
});

export const { setItems, setSelectedOwnerItem } = itemSlice.actions;
export default itemSlice.reducer;
