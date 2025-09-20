import React from "react";
import { MapPin, Store, Package } from "lucide-react";

const ShopCardFromUserSide = ({ data ,getItemByShop}) => {

  return (
    <div onClick={()=>getItemByShop(data._id)} className="w-[60%] cursor-pointer sm:w-[260px] md:w-[250px] lg:w-[300px] flex-shrink-0 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all bg-white mx-auto sm:mx-0 relative">
      {/* Shop Image */}
      <div className="w-full h-30 sm:h-48 md:h-40 overflow-hidden">
        <img
          src={data?.image}
          alt={data?.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Shop Info */}
      <div className="p-4 flex flex-col gap-2">
        {/* Name */}
        <h2 className="text-sm bg-orange-300 p-1 rounded-2xl truncate absolute top-0 right-0 text-[#ff4d2d]">
          {data?.name}
        </h2>

        {/* Items count */}
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <Package className="w-4 h-4 text-[#ff4d2d]" />
          {data?.items?.length || 0} items available
        </p>
      </div>
    </div>
  );
};

export default ShopCardFromUserSide;
