// src/components/CarShowcase.js
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getPublicUrl } from "../utils/publicUrl";

const cars = [
  { name: "Mercedes S-Class", img: "images/s-class.jpg", price: "$250/day" },
  { name: "Mercedes G-Wagon", img: "images/g-wagon.jpg", price: "$400/day" },
  { name: "Mercedes C-Class", img: "images/c-class.jpg", price: "$180/day" },
  { name: "Mercedes E-Class", img: "images/e-class.jpg", price: "$220/day" },
  { name: "Mercedes AMG GT", img: "images/amg-gt.jpg", price: "$500/day" },
];

const CarShowcase = () => {
  return (
    <Wrapper>
      <h2>Our Featured Models</h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {cars.map((car, i) => {
          const imgUrl = getPublicUrl(car.img);
          return (
            <SwiperSlide key={i}>
              <Card>
                <img src={imgUrl} alt={car.name} />
                <h3>{car.name}</h3>
                <p>{car.price}</p>
              </Card>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Wrapper>
  );
};

export default CarShowcase;

const Wrapper = styled.section`
  padding: 4rem 2rem;
  background: ${({ theme }) => theme.colors.background};
  text-align: center;

  h2 {
    font-size: 2.2rem;
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.primary};
  }

  .swiper-button-prev,
  .swiper-button-next {
    color: ${({ theme }) => theme.colors.primary};
  }

  .swiper-pagination-bullet-active {
    background: ${({ theme }) => theme.colors.primary};
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }

  img {
    width: 100%;
    height: 220px;
    object-fit: cover;
  }

  h3 {
    margin: 1rem 0 0.5rem;
    font-size: 1.25rem;
  }

  p {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
  }
`;
