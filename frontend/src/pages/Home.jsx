import React from "react";
import heroImage01 from "../assets/images/hero-img01.png";
import heroImage02 from "../assets/images/hero-img02.png";
import heroImage03 from "../assets/images/hero-img03.png";
import icon01 from "../assets/images/icon01.png";
import icon02 from "../assets/images/icon02.png";
import icon03 from "../assets/images/icon03.png";
import featureimg from "../assets/images/feature-img.png";
import faqImg from "../assets/images/faq-img.png";
import videoIcon from "../assets/images/video-icon.png";
import avatarIcon from "../assets/images/avatar-icon.png";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import About from "../components/About/About";
import ServiceList from "../components/Services/ServiceList";
import DoctorList from "../components/Doctors/DoctorList";
import FaqList from "../components/Faq/FaqList";
import Testimonial from "../components/Testimonial/Testimonial";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();

  const bookAppointment = async () => {
    toast.success("Find your Doctor");
    navigate("/doctors");
  };

  const goToAnalytics = () => {
    navigate("/analytics");
  };

  return (
    <>
      {/* ========== Hero Section ========== */}
      <section className="hero__section pt-[60px] 2xl:h-[800px]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-[90px] items-center justify-between">

            {/* Hero Content */}
            <div>
              <div className="lg:w-[570px]">

                <h1 className="text-[36px] leading-[46px] text-headingColor font-[800] md:text-[45px] md:leading-[70px]">
                  A Smart Solution for Better Healthcare: Helping patients live
                  healthier, longer lives.
                </h1>

                <p className="text__para">
                  We have developed a healthcare platform that supports the
                  diagnosis, treatment, and management of seven major diseases,
                  aiming to improve patient quality of life with accurate
                  information, customized treatment plans, and ongoing support.
                </p>

                <div className="flex gap-4 mt-4">

                  <button onClick={bookAppointment} className="btn">
                    Request an Appointment
                  </button>

                  {/* NEW ANALYTICS BUTTON */}
                  <button
                    onClick={goToAnalytics}
                    className="btn bg-green-600 hover:bg-green-700"
                  >
                    View Lab Analytics
                  </button>

                </div>

              </div>

              {/* Hero Counter */}
              <div className="mt-[30px] lg:mt-[70px] flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-[30px]">

                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                    30+
                  </h2>
                  <span className="w-[100px] h-2 bg-yellowColor rounded-full block mt-[-14px]"></span>
                  <p className="text__para">Years of Experience</p>
                </div>

                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                    15+
                  </h2>
                  <span className="w-[100px] h-2 bg-purpleColor rounded-full block mt-[-14px]"></span>
                  <p className="text__para">Clinic Location</p>
                </div>

                <div>
                  <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
                    100%
                  </h2>
                  <span className="w-[100px] h-2 bg-irisBlueColor rounded-full block mt-[-14px]"></span>
                  <p className="text__para">Patient Satisfaction</p>
                </div>

              </div>
            </div>

            {/* Hero Images */}
            <div className="flex gap-[30px] justify-end">

              <div>
                <img src={heroImage01} className="w-full" alt="" />
              </div>

              <div className="mt-[30px]">
                <img src={heroImage02} className="w-full mb-[30px]" alt="" />
                <img src={heroImage03} className="w-full" alt="" />
              </div>

            </div>

          </div>
        </div>
      </section>
      {/* Hero Section End */}

      {/* Services Intro */}
      <section>
        <div className="container">
          <div className="lg:w-[470px] mx-auto">

            <h2 className="heading text-center">
              Providing the medical services
            </h2>

            <p className="text__para text-center">
              World-class care for everyone. Our health System offers unmatched
              expert health care.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">

            {/* Find Doctor */}
            <div className="py-[30px] px-5">
              <div className="flex items-center justify-center">
                <img src={icon01} alt="icon" />
              </div>

              <div className="mt-[30px]">

                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Find a Doctor
                </h2>

                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  World-class care for everyone. Our health System offers
                  unmatched expert health care.
                </p>

                <Link
                  to="/doctors"
                  className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none"
                >
                  <BsArrowRight className="group-hover:text-white w-6 h-5" />
                </Link>

              </div>
            </div>

            {/* Find Location */}
            <div className="py-[30px] px-5">
              <div className="flex items-center justify-center">
                <img src={icon02} alt="icon" />
              </div>

              <div className="mt-[30px]">

                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Find a Location
                </h2>

                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  World-class care for everyone. Our health System offers
                  unmatched expert health care.
                </p>

                <Link
                  to="/doctors"
                  className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none"
                >
                  <BsArrowRight className="group-hover:text-white w-6 h-5" />
                </Link>

              </div>
            </div>

            {/* Booking */}
            <div className="py-[30px] px-5">
              <div className="flex items-center justify-center">
                <img src={icon03} alt="icon" />
              </div>

              <div className="mt-[30px]">

                <h2 className="text-[26px] leading-9 text-headingColor font-[700] text-center">
                  Booking a Appointment
                </h2>

                <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center">
                  World-class care for everyone. Our health System offers
                  unmatched expert health care.
                </p>

                <Link
                  to="/doctors"
                  className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none"
                >
                  <BsArrowRight className="group-hover:text-white w-6 h-5" />
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      <About />

      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">Our medical services</h2>
            <p className="text__para text-center">
              World-class care for everyone.
            </p>
          </div>
          <ServiceList />
        </div>
      </section>

      {/* Doctors */}
      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">Our great doctors</h2>
            <p className="text__para text-center">
              World-class care for everyone.
            </p>
          </div>
          <DoctorList />
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="container">
          <div className="flex justify-between gap-[50px] lg:gap-0">

            <div className="w-1/2 hidden md:block">
              <img src={faqImg} alt="" />
            </div>

            <div className="w-full md:w-1/2">
              <h2 className="heading">
                Most questions asked by our beloved customers
              </h2>
              <FaqList />
            </div>

          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">

            <h2 className="heading text-center">
              What our patients say
            </h2>

            <p className="text__para text-center">
              World-class care for everyone.
            </p>

          </div>

          <Testimonial />
        </div>
      </section>

    </>
  );
};

export default Home;