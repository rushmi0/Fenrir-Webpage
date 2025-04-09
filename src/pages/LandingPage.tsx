import {Banner} from "../components/Banner";
import {Footer} from "../components/Footer.tsx";
import {SlideShow} from "../components/SlideShow.tsx";
import {RelayOperator} from "../components/RelayOperator.tsx";


export const LandingPage = () => {
    return (
        <>
            <Banner/>
            <SlideShow/>
            <RelayOperator/>
            <Footer/>
        </>
    );
};