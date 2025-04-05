import {useEffect, useState} from "react";
import START_ICON from "../assets/btn.png";
import {OptionCard} from "./OptionCard.tsx";
import NDK, {NDKEvent, NDKRawEvent} from "@nostr-dev-kit/ndk";


export const JoinRelay = () => {

    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [list, setList] = useState<NDKRawEvent[]>([]);
    const [firstEvent, setFirstEvent] = useState<NDKRawEvent | null>(null);


    useEffect(() => {
        if (!publicKey) return;

        const relaySet = [
            "wss://relay.damus.io/",
            "wss://relay.notoshi.win/",
            "wss://nos.lol/",
        ];

        const ndk = new NDK({explicitRelayUrls: relaySet});
        ndk.connect().then(() => console.log("✅ Connected to Relays"));

        const sub = ndk.subscribe(
            {kinds: [10002], authors: [publicKey]},
            {groupable: false}
        );

        sub.on("event", (event: NDKEvent) => {
            setList(prevList => [...prevList, event.rawEvent()]);
        });

        sub.on("eose", () => console.log("🚀 Subscription EOSED"));
    }, [publicKey]);


    useEffect(() => {
        if (list.length > 0) {
            const firstEvent = list[0];
            setFirstEvent(firstEvent);
            console.log("🎯 First Event set:", firstEvent);
        }
    }, [list]);


    const [showLoginCard, setShowCard] = useState(false);
    const closeCard = () => {
        setShowCard(false);
    };

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

