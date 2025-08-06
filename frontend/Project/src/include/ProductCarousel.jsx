import Slider from "react-slick";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import product1 from "../assets/product1.jpg";
const carouselImages = [
  {
    id: 0,
    url: product1,
    alt: "배너1",
  },
  {
    id: 1,
    url: product1,
    alt: "배너2",
  },
  {
    id: 2,
    url: product1,
    alt: "배너3",
  },
];
const CarouselWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  position: relative;

  img {
    width: 100%; /* 부모 너비에 맞춰 늘어나거나 줄어듦 */
    height: 500px;
    object-fit: cover;
    display: block;
    margin: 0 auto;
  }

  /* slick dots 위치 조정 */
  .slick-dots {
    bottom: 20px;
  }

  .slick-dots li {
    margin: 0 5px;
  }

  .slick-dots li button:before {
    font-size: 12px;
    color: white;
    opacity: 0.75;
  }

  .slick-dots li.slick-active button:before {
    opacity: 1;
  }
`;

//  커스텀 화살표
const NextArrow = ({ onClick }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "40px",
      height: "100%",
      position: "absolute",
      top: "0",
      right: "5%",
      cursor: "pointer",
      fontSize: "50px",
      color: "white",
      zIndex: 2,
    }}
    onClick={onClick}
  >
    ᐳ
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "40px",
      height: "100%",
      position: "absolute",
      top: "0",
      left: "5%",
      cursor: "pointer",
      fontSize: "50px",
      color: "white",
      zIndex: 2,
    }}
    onClick={onClick}
  >
    ᐸ
  </div>
);

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <CarouselWrapper>
      <Slider {...settings}>
        {carouselImages.map((image) => (
          <div key={image.id}>
            <img src={image.url} alt={image.alt} />
          </div>
        ))}
      </Slider>
    </CarouselWrapper>
  );
};

export default Carousel;
