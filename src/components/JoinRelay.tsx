import {useEffect, useState} from "react";
import NDK, {NDKEvent, NDKNip07Signer, NDKRawEvent} from "@nostr-dev-kit/ndk";
import START_ICON from "../assets/btn.png";
import {signEvent} from "../lib/core/nip07.ts";
import {OptionCard} from "./OptionCard.tsx";

// สร้าง signer และ ndk
const nip07signer = new NDKNip07Signer();
const ndk = new NDK({signer: nip07signer});


const hashEvent = async (eventId) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(eventId));
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
};


export const JoinRelay = () => {

    const [list, setList] = useState<NDKRawEvent[]>([]);
    const [firstEvent, setFirstEvent] = useState<NDKRawEvent | null>(null);
    const [publicKey, setPublicKey] = useState<string | null>(null);

    nip07signer.user().then(async (user) => {
        if (user.npub) {
            setPublicKey(user.pubkey);
            console.log("🔑 Public Key: ", user.pubkey);
        }
    });


    useEffect(() => {
        if (!publicKey) return;

        const relaySet = [
            "wss://relay.damus.io/",
            "wss://relay.notoshi.win/",
            "wss://nos.lol/",
            "wss://relay.siamstr.com/",
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

    // useEffect เพื่อดึงข้อมูลจาก list[0] เมื่อ list มีการเปลี่ยนแปลง
    useEffect(() => {
        if (list.length > 0) {
            const firstEvent = list[0];
            setFirstEvent(firstEvent);
            console.log("🎯 First Event set:", firstEvent);
        }
    }, [list]);

    // ✅ ฟังก์ชัน Start เมื่อกดปุ่ม
    const start = async () => {
        if (!firstEvent) {
            console.log("⚠️ ไม่มี event ให้ใช้งาน");
            return;
        }

        console.log("🎯 First Event:", firstEvent);

        let protocol;
        if (window.location.protocol === "https:") {
            protocol = "wss:";
        } else {
            protocol = "ws:";
        }

        //const URL_TARGET = `${protocol}://${window.location.hostname}/`;
        const URL = `ws://localhost:6724/`;


        let now = Math.floor(Date.now() / 1000);


        // ✅ สร้าง NDKEvent ใหม่
        // const ndkEvent = new NDKEvent(ndk);
        // ndkEvent.id = "0";
        // ndkEvent.pubkey = `${publicKey}`;
        // ndkEvent.created_at = Math.floor(Date.now() / 1000);
        // ndkEvent.kind = 10002;
        // ndkEvent.tags = [...firstEvent.tags, ["r", URL]];
        // ndkEvent.content = "";

        const daftEvent = {
            id: 0,
            pubkey: `${publicKey}`,
            created_at: now,
            kind: 10002,
            tags: [...firstEvent.tags, ["r", URL]],
            content: ""
        };

        const eventId = await hashEvent(daftEvent);
        const unsignEvent = {
            id: eventId,
            pubkey: `${publicKey}`,
            created_at: now,
            kind: 10002,
            tags: [...firstEvent.tags, ["r", URL]],
            content: ""
        }


        try {

            const signedEvent = await signEvent(unsignEvent);
            console.log("✍️ Signed Event:", signedEvent);

            // const signature = await nip07signer.sign(ndkEvent.rawEvent());
            // ndkEvent.sig = signature;
            // console.log("✍️ Signed Event:", ndkEvent);


            // 🌍 ส่งข้อมูลไปยัง WebSocket
            const ws = new WebSocket(URL);

            ws.onopen = () => {
                console.log("🔗 WebSocket Connected");
                ws.send(JSON.stringify(["EVENT", signedEvent]));
                console.log("📤 Sent Event:", signedEvent);
            };

            // ws.onmessage = (e) => {
            //
            // }

            ws.onerror = (error) => {
                console.error("❌ WebSocket Error:", error);
            };

            ws.onclose = () => {
                console.log("🔌 WebSocket Disconnected");
            };
        } catch (error) {
            console.error("❌ Signing or Publishing Failed:", error);
        }
    };

    const [showLoginCard, setShowLoginCard] = useState(false);

    const closeLoginCard = () => {
        setShowLoginCard(false); // ปิด LoginCard
    };

    return (
        <>
            <div className="w-full flex justify-center lg:justify-start">
                <a>
                    <img
                        className="mt-[50px] hover:scale-[1.05] active:translate-y-2"
                        src={START_ICON}
                        alt="Start"
                        onClick={() => setShowLoginCard(true)}
                    />
                </a>
            </div>

            {showLoginCard && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50">
                    <OptionCard closeLoginCard={closeLoginCard} />
                </div>
            )}

        </>
    );
};
