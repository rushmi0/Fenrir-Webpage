import {useEffect, useState} from "react";
import profileImg from "../assets/profile.gif";
import loninImg from '../assets/Add_Person.svg';
import NDK, {NDKEvent, NDKNip07Signer, NDKRawEvent} from "@nostr-dev-kit/ndk";

export const NavigationBar = () => {
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [firstEvent, setFirstEvent] = useState<NDKRawEvent | null>(null);
    const [list, setList] = useState<NDKRawEvent[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<{ name: string, profileImg: string } | null>(null);

    let protocol;
    if (window.location.protocol === "https:") {
        protocol = "wss:";
    } else {
        protocol = "ws:";
    }

    const URL = `ws://localhost:6724/`;

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLogin = () => {
        const nip07signer = new NDKNip07Signer();
        nip07signer.user().then(async (user) => {
            if (user.npub) {
                setPublicKey(user.pubkey);
                console.log("🔑 Public Key: ", user.pubkey);
            } else {
                console.log("Public key not found");
            }
        });
    };

    const handleLogout = () => {
        setPublicKey(null);
        setUser(null);
        setList([]);
        setFirstEvent(null);
    };

    useEffect(() => {
        if (!publicKey) return;

        const relaySet = [
            "wss://relay.damus.io/",
            "wss://relay.notoshi.win/",
            "wss://nos.lol/",
            URL
        ];

        const ndk = new NDK({explicitRelayUrls: relaySet});
        ndk.connect().then(() => console.log("✅ Connected to Relays"));

        const sub = ndk.subscribe(
            {kinds: [0], authors: [publicKey]},
            {groupable: false}
        );

        sub.on("event", (event: NDKEvent) => {
            const rawEvent = event.rawEvent();
            const profile = rawEvent.content;
            const {name, image} = JSON.parse(profile);

            setUser({
                name: name || "Anonymous",
                profileImg: image || profileImg,
            });
        });

        sub.on("eose", () => console.log("🚀 Subscription EOSED"));

    }, [publicKey]);

    return (
        <nav
            className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-6 py-3 bg-white/30 backdrop-blur-lg shadow-md rounded-2xl">
            <div className="flex items-center space-x-6">
                <img src="/src/assets/fenrir.png" alt="Fenrir Logo" width="50" className="h-auto"/>
                <div className="hidden ms:flex space-x-4 text-gray-700">
                    <a href="#"
                       className="text-xs sm:text-[12px] md:text-[15px] hover:text-[#935CD1] active:text-[#935CD1]">Home</a>
                    <a href="#"
                       className="text-xs sm:text-[12px] md:text-[15px] hover:text-[#935CD1] active:text-[#935CD1]">Relay
                        Operator</a>
                    <a href="#"
                       className="text-xs sm:text-[12px] md:text-[15px] hover:text-[#935CD1] active:text-[#935CD1]">About
                        Us</a>
                </div>
            </div>

            <div className="flex items-center space-x-4 relative">
                <div className="w-10 h-10 rounded-[8px] overflow-hidden border border-gray-300">
                    <img
                        src={user ? user.profileImg : loninImg}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="hover:text-[#935CD1] p-2 text-xs sm:text-[12px] md:text-[15px]"
                    >
                        {user ? user.name : "Login"}
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-7 bg-white shadow-md rounded-md w-64 z-10">
                            {user ? (
                                <>
                                    <a href="#"
                                       className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">Profile</a>
                                    <a href="#"
                                       className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">Settings</a>
                                    <a
                                        href="#"
                                        onClick={handleLogout}  // เมื่อคลิกจะทำการ logout
                                        className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]"
                                    >
                                        Logout
                                    </a>
                                </>
                            ) : (
                                <a
                                    href="#"
                                    onClick={handleLogin}
                                    className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]"
                                >
                                    Login
                                </a>
                            )}
                            <div className="ms:hidden border-t mt-2">
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">Home</a>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">Relay
                                    Operator</a>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">About
                                    Us</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
