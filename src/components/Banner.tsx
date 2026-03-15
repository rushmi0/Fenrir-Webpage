import imgBanner from "../assets/fenrir_pixel_art_v2-bg-remove.png";
import audi from "../assets/dog.mp3";
import { useNavigate } from "react-router-dom";
import classes from "../styles/Banner.module.css";

export const Banner = () => {
  const navigate = useNavigate();
  const audio = new Audio(audi);
  const play = () => {
    audio.play();
  };

  return (
    <div className="container mx-auto mt-20">
      <div className="flex justify-between items-center pt-[5%] col-lg-12 col-md-12 col-sm-12 flex-col-reverse lg:flex-row-reverse xl:flex-row grid lg:grid-rows-none lg:grid-cols-4 grid-rows-4">
        {/* Left Section */}
        <div
          className={`lg:p-[50px] text-center lg:text-start leading-none md:col-span-2 lg:row-span-2 ${classes.leftSection}`}
        >
          <h1 id={classes.head1}>Fenrir-s</h1>
          <h2 id={classes.subhead1}>Nostr Relay</h2>
          <p id={classes.description} className="mt-6 leading-relaxed">
            A lightweight Nostr relay
            <br />
            Run your own relay Own your data
          </p>

          {/* Buttons */}
          <div
            className={`w-full flex gap-3 justify-center lg:justify-start mt-[50px] ${classes.btnGroup}`}
          >
            <button id={classes.btnPrimary} onClick={() => navigate("/app")}>
              Start &rsaquo;
            </button>
            <button id={classes.btnSecondary}>Learn More</button>
          </div>
        </div>

        {/* Right Section */}
        <div
          className={`md:col-span-2 md:row-span-4 lg:row-span-2 row-span-4 order-first lg:order-last ${classes.rightSection}`}
        >
          <div className="lg:relative lg:w-[671px] lg:h-[671px]">
            <img
              onClick={play}
              className={`hover:translate-y-3 active:-translate-y-2 inset-0 object-cover cursor-pointer transition ${classes.bannerImg}`}
              src={imgBanner}
              alt="Fenrir-s"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
