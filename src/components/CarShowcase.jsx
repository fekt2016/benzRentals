// src/components/CarShowcase.js
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const cars = [
  {
    name: "Mercedes-Benz S-Class",
    img: "/images/Class31.webp",
    price: "$250/day",
  },
  {
    name: "Mercedes-Benz G-Wagon",
    img: "/images/Class2.avif",
    price: "$400/day",
  },
  {
    name: "Mercedes-Benz C-Class",
    img: "/images/Class1a.jpg",
    price: "$180/day",
  },
  {
    name: "Mercedes-Benz E-Class",
    img: "/images/2025-mercedes-benz-gle-350.avif",
    price: "$220/day",
  },
  {
    name: "Mercedes-Benz AMG GT",
    img: "/images/Class1.avif",
    price: "$500/day",
  },
];

const CarShowcase = () => {
  return (
    <ShowcaseWrapper>
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
        {cars.map((car, i) => (
          <SwiperSlide key={i}>
            <CarCard>
              <img src={car.img} alt={car.name} />
              <h3>{car.name}</h3>
              <p>{car.price}</p>
            </CarCard>
          </SwiperSlide>
        ))}
      </Swiper>
    </ShowcaseWrapper>
  );
};

export default CarShowcase;

const ShowcaseWrapper = styled.section`
  padding: 4rem 2rem;
  text-align: center;

  h2 {
    font-size: 2.2rem;
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.primary};
  }

  .swiper {
    padding-bottom: 3rem;
  }

  .swiper-button-prev,
  .swiper-button-next {
    color: ${({ theme }) => theme.colors.primary};
  }

  .swiper-pagination-bullet-active {
    background: ${({ theme }) => theme.colors.primary};
  }
`;

const CarCard = styled.div`
  background: #fff;
  border-radius: ${({ theme }) => theme.radius.medium};
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
