import styles from "../styles/OptionCard.module.css";
import InfoIcon from "../assets/Info.svg";
import NDK, {NDKEvent, NDKNip07Signer, NDKRawEvent} from "@nostr-dev-kit/ndk";
import {useEffect, useState} from "react";
import {NostrEvent} from "../lib/core/nip01.ts";
import {getPublicKey, signEvent} from "../lib/core/nip07.ts";

export const OptionCard = ({closeShowCard}: { closeShowCard: () => void }) => {

    const [publicKey, setPublicKey] = useState<string | null>(null);

    const join = () => {

        const nip07signer = new NDKNip07Signer();
        nip07signer.user().then(async (user) => {
            if (user.npub) {
                setPublicKey(user.pubkey);
                console.log("🔑 Public Key: ", user.pubkey);
            } else {
                console.log("Public key not found");
            }


            /*
            let daftEvent = await NostrEvent.create({
                pubkey: user.pubkey.toString(),
                created_at: Math.floor(Date.now() / 1000),
                kind: 10002,
                tags: [...(firstEvent?.tags ?? []), ["r", "ws://localhost:6724/"], ["alt", "join Fenrir-s"]],
                content: ""
            });

            //console.log(`Daft Event: ${JSON.stringify(daftEvent)}`);
            const signedEvent = await signEvent(daftEvent);
            //console.log("✍️ Signed Event:", signedEvent);

            let protocol;
            if (window.location.protocol === "https:") {
                protocol = "wss:";
            } else {
                protocol = "ws:";
            }

            //const URL_TARGET = `${protocol}://${window.location.hostname}/`;
            const URL = `ws://localhost:6724/`;

            try {
                const ws = new WebSocket(URL);

                ws.onopen = () => {
                    console.log("🔗 WebSocket Connected");
                    ws.send(JSON.stringify(["EVENT", signedEvent]));
                    console.log("📤 Sent Event:", signedEvent);
                };

                ws.onmessage = (e) => {
                    console.log("📩 Received Message:", e.data);
                };

                ws.onerror = (error) => {
                    console.error("❌ WebSocket Error:", error);
                };

                ws.onclose = () => {
                    console.log("🔌 WebSocket Disconnected");
                };
            } catch (error) {
                console.error("❌ Signing or Publishing Failed:", error);
            }
            */

        });
    };

    return (
        <>
            <div
                className="flex items-center justify-center w-full h-full md:max-w-[26rem] md:h-[27rem] lg:max-w-[26rem] lg:h-[27rem] bg-white rounded-lg shadow-lg relative">
                <button className={styles.dismiss} onClick={closeShowCard} type="button">
                    <p>×</p>
                </button>

                <div className={styles.header}>
                    <div className={styles.image}>
                        <img src={InfoIcon} alt="Info Icon" width="30rem"/>
                    </div>

                    <div className={styles.content}>
                        <span className={styles.title}>Join Relay</span>
                        <p className={styles.message}>
                            Join this relay! We'll update your metadata or fetch your data to back up here.
                        </p>
                    </div>

                    <div className={styles.actions}>
                        <button className={styles.extension} onClick={join} type="button">Join with extension</button>
                        <button className={styles.sync} type="button">Sync to back up</button>
                    </div>
                </div>
            </div>
        </>
    );
};
