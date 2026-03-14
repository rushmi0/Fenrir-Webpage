import { useNavigate } from "react-router-dom";
import imgDog from "../assets/fenrir_pixel_art_404-remove-bg.png";
import classes from "../styles/NotFound.module.css";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={classes.wrapper}>
      <div className={classes.box}>
        <div className={classes.pixelDog}>
          <img src={imgDog} alt="Fenrir" />
        </div>

        <div className={classes.label}>Error — Page not found</div>

        <div className={classes.heading}>
          <span className={classes.fourOFour}>404</span>
          <span className={classes.subTitle}>Lost Relay</span>
        </div>

        <p className={classes.description}>
          This page wandered off the network.
          <br />
          The relay couldn't find what you're looking for.
        </p>

        <div className={classes.actions}>
          <button className={classes.btnPrimary} onClick={() => navigate("/")}>
            Go Home &rsaquo;
          </button>
          <button className={classes.btnSecondary} onClick={() => navigate(-1)}>
            &larr; Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
