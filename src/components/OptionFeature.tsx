import styles from "../styles/OptionCard.module.css";
import InfoIcon from "../assets/Info.svg";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setShowAuthCard } from "../actions/AuthCardActions.ts";
import * as React from "react";
import {NostrEvent} from "../lib/core/nip01.ts";
import {URL_TARGET} from "../constants.ts";
import {signEvent} from "../lib/core/nip07.ts";

export const OptionFeature = ({ closeShowCard }: { closeShowCard: () => void }) => {
    const dispatch = useDispatch();
    const account = useSelector((state: RootState) => state.account);
    const firstEvent = useSelector((state: RootState) => state.event.firstEvent);
    const pool: string[] = useSelector((state: RootState) => state.relayPool);

    //const URL = `ws://localhost:6724/`;

    const join = async () => {
        if (!account.publicKey) {
            console.log("User is not logged in.");
            closeShowCard();
            dispatch(setShowAuthCard(true));
            return;
        }

        let daftEvent = await NostrEvent.create({
            pubkey: account.publicKey,
            created_at: Math.floor(Date.now() / 1000),
            kind: 10002,
            tags: [
                ...(firstEvent?.tags ?? []),
                ["r", URL_TARGET, "read", "write"],
                ["alt", "join Fenrir-s"]
            ],
            content: ""
        });

        try {
            console.log(pool);

            const signedEvent = await signEvent(daftEvent);

            console.log("✍️ Signed Event:", signedEvent);


            pool.forEach(url => {
                const ws = new WebSocket(url);

                ws.onopen = () => {
                    console.log(`🔗 WebSocket Connected to ${url}`);
                    ws.send(JSON.stringify(["EVENT", signedEvent]));
                    console.log("📤 Sent Event:", signedEvent);
                };

                ws.onmessage = (e) => {
                    console.log(`📩 Received Message from ${url}:`, e.data);
                };

                ws.onerror = (error) => {
                    console.error(`❌ WebSocket Error on ${url}:`, error);
                };

                ws.onclose = () => {
                    console.log(`🔌 WebSocket Disconnected from ${url}`);
                };
            });
        } catch (error) {
            console.error("❌ Signing or Publishing Failed:", error);
        }
    };

    return (
        <>
            <div
                className="flex items-center justify-center w-full h-full md:max-w-[26rem] md:h-[27rem] lg:max-w-[26rem] lg:h-[27rem] bg-white rounded-lg shadow-lg relative">
                <button className={styles.dismiss} onClick={closeShowCard} type="button">
                    <p>×</p>
                </button>

                <div className={styles.header}>
                    <div className={styles.image}
                         style={{ "--color-icons": "#e2feee" } as React.CSSProperties}
                    >
                        <img src={InfoIcon} alt="Info Icon" width="30rem"/>
                    </div>

                    <div className={styles.content}>
                        <span className={styles.title}>Join Relay</span>
                        <p className={styles.message}>
                            Join this relay! We'll update your metadata or fetch your data to back up here.
                        </p>
                    </div>

                    <div className={styles.actions}>
                        <button className={styles.extension} onClick={join} type="button">
                            Join now
                        </button>
                        <button className={styles.sync} type="button">
                            Sync to back up
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
