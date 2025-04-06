import imgBanner from "../assets/fenrir.png";
import audi from "../assets/dog.mp3";
import {JoinRelay} from "./JoinRelay.jsx";

import classes from "../styles/Banner.module.css";

export const Banner = () => {

    const audio = new Audio(audi);
    const play = () => {
        audio.play();
    };

    return (
        <>
            <div className="container mx-auto">

                <div className="flex justify-between items-center pt-[5%] col-lg-12 col-md-12 col-sm-12 flex-col-reverse lg:flex-row-reverse xl:flex-row grid lg:grid-rows-none lg:grid-cols-4 grid-rows-4">

                    <div className="title md:col-span-2 md:row-span-4 lg:row-span-2 row-span-4 order-first lg:order-last">
                        <div className="lg:relative lg:w-[671px] lg:h-[671px]">
                            <img
                                onClick={play}
                                className="hover:translate-y-3 active:-translate-y-2 inset-0 object-cover"
                                src={imgBanner}
                                alt=""
                            />
                        </div>
                    </div>

                    <div className="lg:p-[50px] text-center lg:text-start leading-none md:col-span-2 lg:row-span-2">
                        <h1 className="title" id={classes.head1}>Fenrir-s</h1>
                        <h2 className="topic" id={classes.subhead1}>Nostr Relay</h2>
                        <p className="des" id={classes.description}>
                            Fenrir-s is a Nostr Relay implementation in Kotlin, join us and be part of the freedom!
                        </p>

                        {/* Button for join relay*/}
                        <JoinRelay />
                    </div>


                </div>
            </div>
        </>
    );
};