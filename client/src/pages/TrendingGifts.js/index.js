import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

import "./index.css";

const TrendingGifts = () => {
  const trendingGifts = [
    { image: "/assets/Trendy-Watch.jpg", name: "Trendy Watch" },
    { image: "/assets/Luxury-Perfume.jpg", name: "Luxury Perfume" },
    { image: "/assets/Stylish-Sunglasses.jpg", name: "Stylish Sunglasses" },
    { image: "/assets/Diamond-Bracelet.jpg", name: "Diamond Bracelet" },
    { image: "/assets/Beer-Mug.jpg", name: "Beer Mug" },
    { image: "/assets/Teddy-Bear.jpg", name: "Teddy Bear" },
    { image: "/assets/mug.jpg", name: "Mug" },
    { image: "/assets/necklace.jpg", name: "Necklace" },
    { image: "/assets/small_mug.jpg", name: "Small Mug" },
    { image: "/assets/small_name_print.jpg", name: "Small Name Print" },
    { image: "/assets/small_pillow.jpg", name: "Small Pillow" },
    { image: "/assets/small_shirts.jpg", name: "Small Shirts" },
    { image: "/assets/small_pillo.jpeg", name: "Small Pillow" },
  ];

  const splideOptions = {
    type: "loop",
    autoplay: true,
    pauseOnHover: true,
    perMove: 1,
    perPage: 3,
    gap: "1rem",
    arrows: true,
    pagination: false,
  };

  return (
    <div id="trendinggifts" className="trending-gifts-carousel">
      <div className="inner-gift-container">
        <div className="inner-gift-heading">
          <h1>Trending Gifts</h1>
        </div>
        <Splide options={splideOptions}>
          {trendingGifts.map((gift, index) => (
            <SplideSlide key={index}>
              <div className="trending-gift">
                <div className="trending-inner-gift">
                  <img
                    src={gift.image}
                    alt={gift.name || "Trending gift"}
                    loading="lazy"
                    className="gift-image"
                  />
                  <p className="gift-name">{gift.name}</p>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </div>
  );
};

export default TrendingGifts;
