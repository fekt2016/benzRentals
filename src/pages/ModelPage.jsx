import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import DriversLicenseForm from "../components/Modal/DriversLicenseForm";
import { useNavigate } from "react-router-dom";
// Sample car data
const cars = [
  {
    id: 1,
    name: "Mercedes-Benz S-Class",
    type: "Luxury Sedan",
    fuel: "Hybrid",
    seats: 5,
    price: 250,
    images: [
      "https://images.unsplash.com/photo-1616422285623-0564b7566bbb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1605538031846-770aaebd5b6e?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 2,
    name: "Mercedes-Benz G-Wagon",
    type: "Luxury SUV",
    fuel: "Petrol",
    seats: 5,
    price: 400,
    images: [
      "https://images.unsplash.com/photo-1600185365873-d31a9eac8d4f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617817145159-cfb35c50a648?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1616789068151-d2a0c2ff7605?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 3,
    name: "Mercedes-Benz G-Wagon",
    type: "Luxury SUV",
    fuel: "Petrol",
    seats: 5,
    price: 400,
    images: [
      "https://images.unsplash.com/photo-1600185365873-d31a9eac8d4f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617817145159-cfb35c50a648?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1616789068151-d2a0c2ff7605?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 4,
    name: "Mercedes-Benz G-Wagon",
    type: "Luxury SUV",
    fuel: "Petrol",
    seats: 5,
    price: 400,
    images: [
      "https://images.unsplash.com/photo-1600185365873-d31a9eac8d4f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617817145159-cfb35c50a648?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1616789068151-d2a0c2ff7605?auto=format&fit=crop&w=1000&q=80",
    ],
  },
  {
    id: 5,
    name: "Mercedes-Benz G-Wagon",
    type: "Luxury SUV",
    fuel: "Petrol",
    seats: 5,
    price: 400,
    images: [
      "https://images.unsplash.com/photo-1600185365873-d31a9eac8d4f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617817145159-cfb35c50a648?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1616789068151-d2a0c2ff7605?auto=format&fit=crop&w=1000&q=80",
    ],
  },
];

const ModelPage = () => {
  const { modelId } = useParams();
  const car = cars.find((c) => c.id === parseInt(modelId));
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const navigate = useNavigate();
  // Booking form state
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [location, setLocation] = useState("New York");

  // Modal state
  // const [showModal, setShowModal] = useState(false);

  if (!car) return <p>Car not found.</p>;

  const handleBooking = (e) => {
    e.preventDefault();

    // Validate booking dates if needed
    if (!pickupDate || !returnDate) {
      alert("Please select pickup and return dates");
      return;
    }

    // Navigate to checkout with booking info
    navigate("/checkout", {
      state: {
        booking: {
          car: car.name,
          pickupDate,
          returnDate,
          location,
          price: car.price,
        },
      },
    });
  };
  // const handleModalSubmit = (e) => {
  //   e.preventDefault();
  //   alert("Driver's license submitted! Booking complete.");
  //   setShowModal(false); // Close modal
  // };

  return (
    <PageWrapper>
      <Title>{car.name}</Title>

      <ContentWrapper>
        <SliderWrapper>
          <Swiper
            modules={[Navigation, Pagination, Thumbs, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            thumbs={{ swiper: thumbsSwiper }}
            autoplay={{ delay: 3000 }}
            className="main-swiper"
          >
            {car.images.map((img, i) => (
              <SwiperSlide key={i}>
                <img src={img} alt={`${car.name} ${i + 1}`} />
              </SwiperSlide>
            ))}
          </Swiper>

          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[Navigation, Thumbs]}
            spaceBetween={10}
            slidesPerView={3}
            watchSlidesProgress
            className="thumbs-swiper"
          >
            {car.images.map((img, i) => (
              <SwiperSlide key={i}>
                <ThumbImage src={img} alt={`thumb-${i}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </SliderWrapper>

        <DetailsWrapper>
          <CarDetails>
            <h2>Car Details</h2>
            <ul>
              <li>
                <strong>Type:</strong> {car.type}
              </li>
              <li>
                <strong>Fuel:</strong> {car.fuel}
              </li>
              <li>
                <strong>Seats:</strong> {car.seats}
              </li>
              <li>
                <strong>Price:</strong> ${car.price}/day
              </li>
            </ul>
          </CarDetails>

          <BookingForm onSubmit={handleBooking}>
            <h2>Book This Car</h2>
            <label>
              Pick-up Location
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Miami">Miami</option>
              </select>
            </label>
            <label>
              Pick-up Date
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
              />
            </label>
            <label>
              Return Date
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
              />
            </label>
            <button type="submit">Reserve Now</button>
          </BookingForm>
        </DetailsWrapper>
      </ContentWrapper>

      {/* {showModal && (
        <DriversLicenseForm setShowModal={setShowModal} />
        // <ModalOverlay>
        //   <ModalContent>
        //     <h2>Driver's License Verification</h2>
        //     <Form onSubmit={handleModalSubmit}>
        //       <label>
        //         Driver's License Number
        //         <input type="text" required />
        //       </label>
        //       <label>
        //         Upload License
        //         <input type="file" accept="image/*,.pdf" required />
        //       </label>
        //       <label>
        //         Upload Insurance
        //         <input type="file" accept="image/*,.pdf" required />
        //       </label>
        //       <button type="submit">Submit</button>
        //     </Form>
        //     <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
        //   </ModalContent>
        // </ModalOverlay>
      )} */}
    </PageWrapper>
  );
};

export default ModelPage;

// ---------------- Styled Components ---------------- //
const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.8rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
`;

const SliderWrapper = styled.div`
  flex: 1 1 60%;
  min-width: 300px;

  .main-swiper img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.radius.medium};
  }

  .thumbs-swiper {
    margin-top: 1rem;
  }

  .thumbs-swiper img {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.radius.small};
    cursor: pointer;
  }
`;

const DetailsWrapper = styled.div`
  flex: 1 1 35%;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CarDetails = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.radius.medium};
  box-shadow: ${({ theme }) => theme.shadows.card};

  h2 {
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    li {
      margin-bottom: 0.5rem;
      strong {
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  }
`;

const BookingForm = styled.form`
  background: ${({ theme }) => theme.colors.white};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.radius.medium};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h2 {
    margin-bottom: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    font-weight: 500;
    font-size: 1rem;
  }

  input,
  select {
    padding: 0.5rem 1rem;
    border-radius: ${({ theme }) => theme.radius.small};
    border: 1px solid #ccc;
    margin-top: 0.5rem;
  }

  button {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    padding: 0.8rem;
    border: none;
    border-radius: ${({ theme }) => theme.radius.small};
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryDark};
    }
  }
`;

const ThumbImage = styled.img`
  border: 2px solid transparent;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

// ---------------- Modal Styles ---------------- //
