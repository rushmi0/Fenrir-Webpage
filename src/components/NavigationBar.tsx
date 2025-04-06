import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setAccount, clearAccount} from "../actions/AccountAction";
import {RootState} from "../store";
import NDK, {NDKEvent, NDKNip07Signer, NDKRawEvent} from "@nostr-dev-kit/ndk";
import {RELAYS_SET} from "../constants.ts";
import {clearRelayPool} from "../actions/RelayPoolAction.ts";

import CLOSE_IMG from "../assets/close.png";
import MENU_IMG from "../assets/menu.svg";


export const NavigationBar = () => {
    const dispatch = useDispatch();
    const account = useSelector((state: RootState) => state.account);
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleLogin = async () => {
        const nip07 = new NDKNip07Signer();
        const userMeta = await nip07.user();
        if (!userMeta.pubkey) {
            console.warn("Public key not found");
            return;
        }

        const pubkey = userMeta.pubkey;
        const ndk = new NDK({explicitRelayUrls: RELAYS_SET});
        await ndk.connect();

        const sub = ndk.subscribe({kinds: [0], authors: [pubkey]}, {groupable: false});
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
                const image = parsed.picture || "";
                dispatch(setAccount(pubkey, name, image));
                console.log("👤 Updated Profile:", {name, image});
            }
            console.log("✅ Profile fetch completed");
        });
    };

    const handleLogout = () => {
        dispatch(clearAccount());
        dispatch(clearRelayPool());
        setIsOpen(false);
    };

    return (
        <nav className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-6 py-3 xs:py-0.5 bg-white/30 backdrop-blur-lg shadow-md rounded-2xl">
            {/* Left - Logo & Menu */}
            <div className="flex items-center space-x-6">
                <img src="/src/assets/fenrir.png" alt="Fenrir Logo" width="50" className="h-auto"/>
                <div className="hidden ms:flex space-x-4 text-gray-700">
                    <a href="#" className="text-xs xs:text-[10px] sm:text-[12px] md:text-[15px] hover:text-[#935CD1]">Home</a>
                    <a href="#" className="text-xs xs:text-[10px] sm:text-[12px] md:text-[15px] hover:text-[#935CD1]">Relay Operator</a>
                    <a href="#" className="text-xs xs:text-[10px] sm:text-[12px] md:text-[15px] hover:text-[#935CD1]">About Us</a>
                </div>
            </div>

            {/* Right - Profile/Name and Menu */}
            <div className="flex items-center space-x-4 relative">
                {account.publicKey ? (
                    <>
                        {/* Profile Image */}
                        <div className="w-8 xs:w-6 h-8 xs:h-6 rounded-[8px] overflow-hidden border border-gray-300 cursor-pointer"
                             onClick={toggleDropdown}>
                            <img
                                src={account.image}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Name */}
                        <button
                            onClick={toggleDropdown}
                            className="hover:text-[#935CD1] p-2 text-xs xs:text-[10px] sm:text-[12px] md:text-[15px]"
                        >
                            {account.name}
                        </button>
                    </>
                ) : (
                    <>
                        {/* Login Button */}
                        <button
                            onClick={handleLogin}
                            className="hover:text-[#935CD1] p-2 text-xs xs:text-[10px] sm:text-[12px] md:text-[15px]"
                        >
                            Login
                        </button>
                    </>
                )}

                {/* Menu / Close Icon */}
                <button onClick={toggleDropdown}>
                    <img
                        src={isOpen ? CLOSE_IMG : MENU_IMG}
                        alt="Menu Icon"
                        className="w-5 xs:w-4 h-5 xs:h-4"
                    />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="mt-6 absolute top-full right-0 bg-white shadow-md rounded-md w-64 z-10">
                        {/* If logged in, show profile and logout options */}
                        {account.publicKey ? (
                            <>
                                <a href="#"
                                   className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">Join Relay</a>
                                <a href="#"
                                   className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">Sync to Back
                                    Up</a>
                                <a href="#"
                                   className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">Profile</a>
                                <a href="#"
                                   className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">Settings</a>
                                <a
                                    href="#"
                                    onClick={handleLogout}
                                    className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]"
                                >
                                    Logout
                                </a>
                            </>
                        ) : (
                            <>
                                <a href="#"
                                   className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">Join Relay</a>
                                <a href="#"
                                   className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">Sync to Back Up</a>
                            </>
                        )}

                        <div className="ms:hidden border-t mt-2">
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">Home</a>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">Relay Operator</a>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">About Us</a>
                        </div>
                    </div>
                )}
            </div>
        </nav>

    );
};
