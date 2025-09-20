const CategoryCard = ({ data ,hendelFilterByCategery}) => {
  return (
    <div onClick={()=>hendelFilterByCategery(data.category)} className="relative cursor-pointer w-[80px] h-[80px] md:w-[120px] md:h-[120px] rounded-2xl border-2 border-[#ff4d2d] shrink-0 overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <img
        src={data?.image}
        alt={data?.category || "Category"}
        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
        loading="lazy"
      />
      <div className="absolute bottom-0 left-0 w-full bg-white/70 px-2 py-1 rounded-t-xl text-center text-[10px] md:text-base font-semibold text-gray-800 backdrop-blur-md">
        {data?.category}
      </div>
    </div>
  );
};

export default CategoryCard;
