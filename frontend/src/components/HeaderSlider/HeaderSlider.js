import React from 'react'
import Slider from "react-slick"
import slide1 from "../../assets/images/slide1.png"
import slide2 from "../../assets/images/slide2.png"
import slide3 from "../../assets/images/slide3.png"
import slide4 from "../../assets/images/slide4.png"

function HeaderSlider() {
    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 2000,
        slidesToShow: 1,
        slidesToScroll: 1
    }
    return (
        <div className="container mt-1 pt-4">
            <Slider {...settings}>
                <img src={slide1} className="w-100" alt="Slide 1" />
                <img src={slide2} className="w-100" alt="Slide 2" />
                <img src={slide3} className="w-100" alt="Slide 3" />
                <img src={slide4} className="w-100" alt="Slide 4" />
            </Slider>
        </div>
    )
}

export default HeaderSlider