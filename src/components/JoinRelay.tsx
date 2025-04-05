// src/components/JoinRelay.tsx
import { useEffect, useState } from "react";
import START_ICON from "../assets/btn.png";
import { OptionCard } from "./OptionCard";
import NDK, { NDKEvent, NDKRawEvent } from "@nostr-dev-kit/ndk";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { RELAYS_SET } from "../constants";
import { setFirstEvent, clearFirstEvent } from "../actions/EventAction";

export const JoinRelay = () => {
    const dispatch = useDispatch();
    const account = useSelector((state: RootState) => state.account);
    const [showLoginCard, setShowCard] = useState(false);

    useEffect(() => {
        if (!account.publicKey) return;

        dispatch(clearFirstEvent());

        const ndk = new NDK({ explicitRelayUrls: RELAYS_SET });
        ndk.connect().then(() => console.log("✅ Connected to Relays"));

        const sub = ndk.subscribe(
            { kinds: [10002], authors: [account.publicKey] },
            { groupable: false }
        );

        let highestEvent: NDKRawEvent | null = null;

        const handleEvent = (evt: NDKEvent) => {
            const raw = evt.rawEvent();

            if (!highestEvent || raw.created_at > highestEvent.created_at) {
                highestEvent = raw;
            }
        };

        const handleEose = () => {
            if (highestEvent) {
                dispatch(setFirstEvent(highestEvent));
                console.log("🎯 FirstEvent set to:", highestEvent);
            }

            // ✅ ถอด event listeners ออกเพื่อหยุดการทำงาน
            sub.off("event", handleEvent);
            sub.off("eose", handleEose);
        };

        sub.on("event", handleEvent);
        sub.on("eose", handleEose);

        return () => {
            // ✅ ถอด event listeners หาก component ถูก unmount
            sub.off("event", handleEvent);
            sub.off("eose", handleEose);
            dispatch(clearFirstEvent());
        };
    }, [account.publicKey, dispatch]);


    const closeCard = () => setShowCard(false);

    return (
        <>
            <div className="detail w-full flex justify-center lg:justify-start space-x-4">
                <a className="detail-btn">
                    <img
                        className="mt-[50px] hover:scale-[1.05] active:translate-y-2"
                        src={START_ICON}
                        alt="Start"
                        onClick={() => setShowCard(true)}
                    />
                </a>
            </div>

            {showLoginCard && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50">
                    <OptionCard closeShowCard={closeCard} />
                </div>
            )}
        </>
    );
};
