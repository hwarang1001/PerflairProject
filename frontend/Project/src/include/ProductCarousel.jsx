import Slider from "react-slick";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

const Carousel = ({ images }) => {
  const settings = {
    dots: true,
    infinite: images.length > 1,
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
        {images.map((imageUrl, index) => (
          <div key={index}>
            <img src={imageUrl} alt={`image-${index}`} />
          </div>
        ))}
      </Slider>
    </CarouselWrapper>
  );
};

export default Carousel;
