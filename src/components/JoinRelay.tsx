import { useEffect, useState } from "react";
import NDK, { NDKEvent, NDKNip07Signer, NDKRawEvent } from "@nostr-dev-kit/ndk";
import START_ICON from "../assets/btn.png";

// สร้าง signer และ ndk
const nip07signer = new NDKNip07Signer();
const ndk = new NDK({ signer: nip07signer });

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

        const ndk = new NDK({ explicitRelayUrls: relaySet });
        ndk.connect().then(() => console.log("✅ Connected to Relays"));

        const sub = ndk.subscribe(
            { kinds: [10002], authors: [publicKey] },
            { groupable: false }
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

        //const URL = `${protocol}://${window.location.hostname}/`;
        const URL = `ws://localhost:6724/`;


        // ✅ สร้าง NDKEvent ใหม่
        const ndkEvent = new NDKEvent(ndk);
        ndkEvent.id = "0";
        ndkEvent.pubkey = `${publicKey}`;
        ndkEvent.created_at = Math.floor(Date.now() / 1000);
        ndkEvent.kind = 10002;  // กำหนดประเภท event
        ndkEvent.tags = [...firstEvent.tags, ["r", URL]];
        ndkEvent.content = "";

        const daftEvent = {
            id: 0,
            pubkey: `${publicKey}`,
            created_at: Math.floor(Date.now() / 1000),
            kind: 10002,
            tags: [...firstEvent.tags, ["r", URL]],
            content: ""
        };


        try {
            const signature = await nip07signer.sign(ndkEvent.rawEvent());
            ndkEvent.sig = signature;
            console.log("✍️ Signed Event:", ndkEvent);


            console.log("✍️ Published Event:", ndkEvent);

            // 🌍 ส่งข้อมูลไปยัง WebSocket
            const ws = new WebSocket(URL);

            ws.onopen = () => {
                console.log("🔗 WebSocket Connected");
                ws.send(JSON.stringify(["EVENT", ndkEvent]));
                console.log("📤 Sent Event:", ndkEvent.rawEvent());
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

    return (
        <div className="w-full flex justify-center lg:justify-start">
            <a>
                <img
                    className="mt-[50px] hover:scale-[1.05] active:translate-y-2"
                    src={START_ICON}
                    alt="Start"
                    onClick={start}  // 🎯 กดแล้วเริ่มกระบวนการ
                />
            </a>
        </div>
    );
};
