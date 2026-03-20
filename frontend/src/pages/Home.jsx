import React, { useContext } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import About from "../components/About/About";
import ServiceList from "../components/Services/ServiceList";
import DoctorList from "../components/Doctors/DoctorList";
import FaqList from "../components/Faq/FaqList";
import Testimonial from "../components/Testimonial/Testimonial";
import { toast } from "react-toastify";
import { authContext } from "../context/AuthContext";

const Home = () => {

  const navigate = useNavigate();
  const { role } = useContext(authContext);

  const bookAppointment = () => {
    toast.success("Find your Doctor");
    navigate("/doctors");
  };

  const goToAnalytics = () => {
    navigate("/analytics");
  };

  const goToWorkflow = () => {
    navigate("/lab-tracker");
  };

  const goToReportAnalyzer=()=>{
    navigate("/report-ai")
  }

  const goToHealthPrediction = () => {
  navigate("/ai-risk");
};

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero__section pt-[60px] 2xl:h-[800px]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-[90px] items-center justify-between">

            <div>
              <div className="lg:w-[570px]">

                <h1 className="text-[36px] leading-[46px] text-headingColor font-[800] md:text-[45px] md:leading-[70px]">
                  A Smart Solution for Better Healthcare: Helping patients live healthier, longer lives.
                </h1>

                <p className="text__para">
                  We have developed a healthcare platform that supports the
                  diagnosis, treatment, and management of seven major diseases,
                  aiming to improve patient quality of life.
                </p>
                

<div className="flex gap-4 mt-4 flex-wrap">

  <button onClick={bookAppointment} className="btn">
    Request an Appointment
  </button>

  {/* Assistant only features */}
  {role === "assistant" && (
    <>
      <button
        onClick={goToAnalytics}
        className="btn bg-green-600 hover:bg-green-700"
      >
        View Lab Analytics
      </button>

      <button
        onClick={goToWorkflow}
        className="btn bg-purple-600 hover:bg-purple-700"
      >
        Track Lab Workflow
      </button>
    </>
  )}

  {/* Doctor + Assistant */}
  {(role === "assistant" || role === "doctor") && (
    <button
      onClick={goToReportAnalyzer}
      className="btn bg-blue-600 hover:bg-blue-700"
    >
      AI Medical Report Analyzer
    </button>
  )}

  {/* Patient + Doctor */}
  {(role === "patient" || role === "doctor") && (
    <button
      onClick={goToHealthPrediction}
      className="btn bg-orange-600 hover:bg-orange-700"
    >
      AI Health Risk Prediction
    </button>
  )}

</div>

              </div>

              {/* HERO COUNTERS */}

              <div className="mt-[30px] lg:mt-[70px] flex flex-col lg:flex-row gap-5 lg:gap-[30px]">

                <div>
                  <h2 className="text-[36px] font-[700] text-headingColor">
                    30+
                  </h2>
                  <span className="w-[100px] h-2 bg-yellowColor rounded-full block mt-[-10px]"></span>
                  <p className="text__para">Years of Experience</p>
                </div>

                <div>
                  <h2 className="text-[36px] font-[700] text-headingColor">
                    15+
                  </h2>
                  <span className="w-[100px] h-2 bg-purpleColor rounded-full block mt-[-10px]"></span>
                  <p className="text__para">Clinic Location</p>
                </div>

                <div>
                  <h2 className="text-[36px] font-[700] text-headingColor">
                    100%
                  </h2>
                  <span className="w-[100px] h-2 bg-irisBlueColor rounded-full block mt-[-10px]"></span>
                  <p className="text__para">Patient Satisfaction</p>
                </div>

              </div>
            </div>

            {/* HERO IMAGES */}

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

      {/* SERVICES */}

      <section>
        <div className="container">

          <div className="lg:w-[470px] mx-auto">
            <h2 className="heading text-center">
              Providing the medical services
            </h2>

            <p className="text__para text-center">
              World-class care for everyone. Our health system offers unmatched expert health care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[55px]">

            <div className="py-[30px] px-5 text-center">
              <img src={icon01} alt="" className="mx-auto" />
              <h2 className="text-[26px] font-[700] mt-[30px]">
                Find a Doctor
              </h2>

              <p className="text__para mt-4">
                World-class care for everyone.
              </p>

              <Link
                to="/doctors"
                className="w-[44px] h-[44px] rounded-full border mx-auto mt-[30px] flex items-center justify-center hover:bg-primaryColor"
              >
                <BsArrowRight />
              </Link>

            </div>

            <div className="py-[30px] px-5 text-center">
              <img src={icon02} alt="" className="mx-auto" />
              <h2 className="text-[26px] font-[700] mt-[30px]">
                Find a Location
              </h2>

              <p className="text__para mt-4">
                World-class care for everyone.
              </p>

              <Link
                to="/doctors"
                className="w-[44px] h-[44px] rounded-full border mx-auto mt-[30px] flex items-center justify-center hover:bg-primaryColor"
              >
                <BsArrowRight />
              </Link>

            </div>

            <div className="py-[30px] px-5 text-center">
              <img src={icon03} alt="" className="mx-auto" />
              <h2 className="text-[26px] font-[700] mt-[30px]">
                Book Appointment
              </h2>

              <p className="text__para mt-4">
                World-class care for everyone.
              </p>

              <Link
                to="/doctors"
                className="w-[44px] h-[44px] rounded-full border mx-auto mt-[30px] flex items-center justify-center hover:bg-primaryColor"
              >
                <BsArrowRight />
              </Link>

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

      <section>
        <div className="container">
          <div className="flex justify-between gap-[50px]">

            <div className="w-1/2 hidden md:block">
              <img src={faqImg} alt="" />
            </div>

            <div className="w-full md:w-1/2">
              <h2 className="heading">
                Most questions asked by our customers
              </h2>
              <FaqList />
            </div>

          </div>
        </div>
      </section>

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