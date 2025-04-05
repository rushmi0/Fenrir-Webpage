import { useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setAccount, clearAccount} from "../actions/AccountAction";
import {RootState} from "../store";
import defaultProfileImg from "../assets/profile.gif";
import NDK, {NDKEvent, NDKNip07Signer} from "@nostr-dev-kit/ndk";
import {RELAYS_SET} from "../constants.ts";
import {clearRelayPool} from "../actions/RelayPoolAction.ts";

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

        // subscribe to kind 0 (profile)
        const sub = ndk.subscribe(
            {kinds: [0], authors: [pubkey]},
            {groupable: false}
        );

        sub.on("event", (evt: NDKEvent) => {
            const raw = evt.rawEvent();
            let name = "Anonymous";
            let image = defaultProfileImg;
            const parsed = JSON.parse(raw.content);
            if (parsed.name) name = parsed.name;
            if (parsed.image) image = parsed.image;

            dispatch(setAccount(pubkey, name, image));
        });

        sub.on("eose", () => {
            console.log("Profile fetch completed");
        });
    };

    const handleLogout = () => {
        dispatch(clearAccount());
        dispatch(clearRelayPool());
        setIsOpen(false);
    };

    return (
        <nav
            className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-6 py-3 bg-white/30 backdrop-blur-lg shadow-md rounded-2xl">
            {/* Left - Logo & Menu */}
            <div className="flex items-center space-x-6">
                <img src="/src/assets/fenrir.png" alt="Fenrir Logo" width="50" className="h-auto"/>
                <div className="hidden ms:flex space-x-4 text-gray-700">
                    <a href="#" className="text-xs sm:text-[12px] md:text-[15px] hover:text-[#935CD1]">Home</a>
                    <a href="#" className="text-xs sm:text-[12px] md:text-[15px] hover:text-[#935CD1]">Relay
                        Operator</a>
                    <a href="#" className="text-xs sm:text-[12px] md:text-[15px] hover:text-[#935CD1]">About Us</a>
                </div>
            </div>

            <div className=" flex items-center space-x-4 ">
                {/* Profile Image (clickable) */}
                <div
                    className="w-10 h-10 rounded-[8px] overflow-hidden border border-gray-300 cursor-pointer"
                    onClick={toggleDropdown}
                >
                    <img
                        src={account.image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Name / Login Button */}
                <button
                    onClick={toggleDropdown}
                    className="hover:text-[#935CD1] p-2 text-xs sm:text-[12px] md:text-[15px]"
                >
                    {account.publicKey ? account.name : "Login"}
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="mt-2 absolute top-full right-0 bg-white shadow-md rounded-md w-64 z-10">
                        {account.publicKey ? (
                            <>
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
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#935CD1]">About Us</a>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};
