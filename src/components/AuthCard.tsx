import styles from "../styles/OptionCard.module.css";
import InfoIcon from "../assets/fenrir.svg";
import NDK, { NDKEvent, NDKNip07Signer, NDKPrivateKeySigner, NDKRawEvent } from "@nostr-dev-kit/ndk";
import { RELAYS_SET } from "../constants.ts";
import { setAccount } from "../actions/AccountAction.ts";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as React from "react";
import { Toast } from "./Toast";
import {setShowAuthCard} from "../actions/AuthCardActions.ts";

export const AuthCard = ({ onClose }: { onClose: () => void }) => {
    const dispatch = useDispatch();
    const [nsec, setNsec] = useState("");
    const [toast, setToast] = useState<{ message: string; type?: "error" | "success" } | null>(null);

    // Fetch profile data
    const fetchProfile = async (pubkey: string, nsec?: string) => {
        const ndk = new NDK({ explicitRelayUrls: RELAYS_SET });
        await ndk.connect();

        const sub = ndk.subscribe({ kinds: [0], authors: [pubkey] }, { groupable: false });
        let highestEvent: NDKRawEvent | null = null;

        sub.on("event", (evt: NDKEvent) => {
            const raw = evt.rawEvent();
            if (!highestEvent || raw.created_at > highestEvent.created_at) {
                highestEvent = raw;
            }
        });

        sub.on("eose", () => {
            if (highestEvent) {
                const parsed = JSON.parse(highestEvent.content);
                const name = parsed.name || "Anonymous";
                const displayName = parsed.display_name || "";
                const about = parsed.about || "";
                const image = parsed.picture || "";
                const banner = parsed.banner || "";
                const lud16 = parsed.lud16 || "";

                dispatch(setAccount(pubkey, name, image, displayName, about, banner, lud16, nsec));
                dispatch(setShowAuthCard(false));
            }
        });
    };

    // Handle login with NSEC
    const handleLoginWithNsec = async () => {
        if (!nsec.startsWith("nsec")) {
            setToast({ message: "Invalid nsec", type: "error" });
            setTimeout(() => setToast(null), 2000);
            return;
        }

        try {
            const signer = new NDKPrivateKeySigner(nsec);
            const pubkey = signer.pubkey;

            await fetchProfile(pubkey, nsec);
        } catch (error) {
            console.error("Error during login with nsec:", error);
            setToast({ message: "Error during login", type: "error" });
            setTimeout(() => setToast(null), 2000);
        }
    };

    // Handle login with extension
    const handleLoginWithExtension = async () => {
        try {
            const nip07 = new NDKNip07Signer();
            const userMeta = await nip07.user();
            if (!userMeta.pubkey) return;

            await fetchProfile(userMeta.pubkey);
        } catch (error) {
            console.error("Error during login with extension:", error);
        }
    };

    return (
        <>
            <div
                className="w-full h-full fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                onClick={onClose}
            >
                <div
                    className="relative md:h-[27rem] xs:h-[25rem] md:max-w-md bg-white rounded-lg shadow-lg m-6 md:m-0 mt-40 md:mt-0"
                    onClick={(e) => e.stopPropagation()}
                >

                <button className={styles.dismiss} type="button" onClick={onClose}>
                        <p>×</p>
                    </button>

                    <div className="flex items-center justify-center w-full h-full md:max-w-[28rem] lg:max-w-[28rem]">
                        <div className={styles.header}>
                            <div className={styles.image} style={{ "--color-icons": "#eadbf8" } as React.CSSProperties}>
                                <img src={InfoIcon} alt="Fenrir Icon" width="75rem" />
                            </div>

                            <div className={styles.actions}>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 mb-3 text-[#242525] text-sm leading-6 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#935CD1] placeholder-gray-400"
                                    placeholder="nsec..."
                                    value={nsec}
                                    onChange={(e) => setNsec(e.target.value)}
                                />
                                <button
                                    className="hover:opacity-90 inline-flex mt-3 px-4 py-2 text-white text-sm leading-6 font-medium justify-center w-full rounded-md border border-[#935CD1] bg-[#935CD1] shadow-sm active:-translate-y-2 transition-all duration-200"
                                    type="button"
                                    onClick={handleLoginWithNsec}
                                >
                                    Log in
                                </button>
                            </div>

                            <div className={styles.content}>
                                <p
                                    className={styles.message}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <span style={{ flex: 1, borderBottom: "1px solid #d3d3d3", marginRight: "1rem" }}></span>
                                    or
                                    <span style={{ flex: 1, borderBottom: "1px solid #d3d3d3", marginLeft: "1rem" }}></span>
                                </p>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    className="inline-flex px-4 py-2 text-[#935CD1] border-2 border-[#935CD1] text-sm leading-6 font-medium justify-center w-full rounded-md shadow-sm transition-all duration-200 hover:bg-[#935CD1] hover:text-white active:bg-[#935CD1] active:text-white active:-translate-y-2"
                                    type="button"
                                    onClick={handleLoginWithExtension}
                                >
                                    Login with extension
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} />}
        </>
    );
};
