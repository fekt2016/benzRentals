// src/components/CarShowcase.jsx
import React from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const cars = [
  {
    name: "Mercedes-Benz S-Class",
    img: "../public/images/Class31.webp",
    price: "$250/day",
  },
  {
    name: "Mercedes-Benz G-Wagon",
    img: "../public/images/class2.avif",
    price: "$400/day",
  },
  {
    name: "Mercedes-Benz C-Class",
    img: "../public/images/Class4.jpg",
    price: "$180/day",
  },
  {
    name: "Mercedes-Benz E-Class",
    img: "../public/images/Class5.jpg",
    price: "$220/day",
  },
  {
    name: "Mercedes-Benz AMG GT",
    img: "https://images.unsplash.com/photo-1617817145159-cfb35c50a648?auto=format&fit=crop&w=1000&q=80",
    price: "$500/day",
  },
];

const CarShowcase = () => {
  return (
    <Wrapper>
      <Title>Our Featured Models</Title>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500 }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {cars.map((car, index) => (
          <SwiperSlide key={index}>
            <Card>
              <CarImage src={car.img} alt={car.name} />
              <CarInfo>
                <CarName>{car.name}</CarName>
                <CarPrice>{car.price}</CarPrice>
              </CarInfo>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Wrapper>
  );
};

export default CarShowcase;

// ---------------- Styled Components ---------------- //

const Wrapper = styled.section`
  padding: 4rem 2rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.background || "#f8f9fa"};
`;

const Title = styled.h2`
  font-size: 2.4rem;
  margin-bottom: 2.5rem;
  color: ${({ theme }) => theme.colors.primary || "#c3002f"};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white || "#fff"};
  border-radius: ${({ theme }) => theme.radius.medium || "12px"};
  overflow: hidden;
  box-shadow: ${({ theme }) =>
    theme.shadows.card || "0px 4px 12px rgba(0,0,0,0.1)"};
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CarImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
`;

const CarInfo = styled.div`
  padding: 1rem 1rem 1.5rem;
`;

const CarName = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text || "#333"};
`;

const CarPrice = styled.p`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary || "#c3002f"};
`;
