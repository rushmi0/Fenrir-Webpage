import icon from "../assets/icon.svg";
import * as React from "react";

export const SlideShow = () => {
    return (
        <>
            <div className="mt-10">
                <div
                    className="slider"
                    style={
                        {
                            "--width": "600px",
                            "--height": "64px",
                            "--quantity": 10,
                        } as React.CSSProperties
                    }
                >
                    <div className="list">

                        <div className="item" style={{["--position"]: 1} as React.CSSProperties}>
                            <div className="bg-slideshow">
                                <div className="flex justify-center items-center">
                                    <div className="w-[50px]">
                                        <img className="w-[32px] h-[32px] " src={icon} alt=""/>
                                    </div>

                                    <a className="text-[16px] mb-1"
                                       href="https://github.com/nostr-protocol/nips/blob/master/01.md"
                                       target="_blank"
                                    >
                                        NIP-01 Basic Protocol Flow
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="item" style={{"--position": 2} as React.CSSProperties}>
                            <p className="bg-slideshow">
                                <div className="flex justify-center items-center">
                                    <div className="w-[50px]">
                                        <img className="w-[32px] h-[32px] " src={icon} alt=""/>
                                    </div>
                                    <a className="text-[16px] mb-1"
                                       href="https://github.com/nostr-protocol/nips/blob/master/02.md"
                                       target="_blank"
                                    >
                                        NIP-02 Follow List
                                    </a>
                                </div>
                            </p>
                        </div>
                        <div className="item " style={{"--position": 3} as React.CSSProperties}>
                            <p className="bg-slideshow">
                                <div className="flex justify-center items-center">
                                    <div className="w-[50px]">
                                        <img className="w-[32px] h-[32px] " src={icon} alt=""/>
                                    </div>
                                    <a className="text-[16px] mb-1"
                                       href="https://github.com/nostr-protocol/nips/blob/master/04.md"
                                       target="_blank"
                                    >
                                        NIP-04 Encrypted Direct Messages
                                    </a>
                                </div>
                            </p>
                        </div>
                        <div className="item" style={{"--position": 4} as React.CSSProperties}>
                            <p className="bg-slideshow">
                                <div className="flex justify-center items-center">
                                    <div className="w-[50px]">
                                        <img className="w-[32px] h-[32px] " src={icon} alt=""/>
                                    </div>
                                    <a className="text-[16px] mb-1"
                                       href="https://github.com/nostr-protocol/nips/blob/master/09.md"
                                       target="_blank"
                                    >
                                        NIP-09 Event Deletion
                                    </a>
                                </div>
                            </p>
                        </div>
                        <div className="item " style={{"--position": 5} as React.CSSProperties}>
                            <p className="bg-slideshow">
                                <div className="flex justify-center items-center">
                                    <div className="w-[50px]">
                                        <img className="w-[32px] h-[32px] " src={icon} alt=""/>
                                    </div>
                                    <a className="text-[16px] mb-1"
                                       href="https://github.com/nostr-protocol/nips/blob/master/11.md"
                                       target="_blank"
                                    >
                                        NIP-11 Relay Information
                                    </a>
                                </div>
                            </p>
                        </div>
                        <div className="item " style={{"--position": 6} as React.CSSProperties}>
                            <p className="bg-slideshow">
                                <div className="flex justify-center items-center">
                                    <div className="w-[50px]">
                                        <img className="w-[32px] h-[32px] " src={icon} alt=""/>
                                    </div>
                                    <a className="text-[16px] mb-1"
                                       href="https://github.com/nostr-protocol/nips/blob/master/13.md"
                                       target="_blank"
                                    >
                                        NIP-13 Proof of Work
                                    </a>
                                </div>
                            </p>
                        </div>
                        <div className="item " style={{"--position": 7} as React.CSSProperties}>
                            <p className="bg-slideshow">
                                <div className="flex justify-center items-center">
                                    <div className="w-[50px]">
                                        <img className="w-[32px] h-[32px] " src={icon} alt=""/>
                                    </div>
                                    <a className="text-[16px] mb-1"
                                       href="https://github.com/nostr-protocol/nips/blob/master/15.md"
                                       target="_blank"
                                    >
                                        NIP-15 Marketplace
                                    </a>
                                </div>
                            </p>
                        </div>
                        <div className="item " style={{"--position": 8} as React.CSSProperties}>
                            <p className="bg-slideshow">
                                <div className="flex  justify-center items-center">
                                    <div className="w-[50px]">
                                        <img className="w-[32px] h-[32px] " src={icon} alt=""/>
                                    </div>
                                    <a className="text-[16px] mb-1"
                                       href="https://github.com/nostr-protocol/nips/blob/master/28.md"
                                       target="_blank"
                                    >
                                        NIP-28 Public Chat
                                    </a>
                                </div>
                            </p>
                        </div>
                        <div className="item " style={{"--position": 9} as React.CSSProperties}>
                            <p className="bg-slideshow">
                                <div className="flex justify-center items-center">
                                    <div className="w-[50px]">
                                        <img className="w-[32px] h-[32px] " src={icon} alt=""/>
                                    </div>
                                    <a className="text-[16px] mb-1"
                                       href="https://github.com/nostr-protocol/nips/blob/master/45.md"
                                       target="_blank"
                                    >
                                        NIP-45 Event Counts
                                    </a>
                                </div>
                            </p>
                        </div>
                        <div className="item " style={{"--position": 10} as React.CSSProperties}>
                            <p className="bg-slideshow">
                                <div className="flex justify-center items-center">
                                    <div className="w-[50px]">
                                        <img className="w-[32px] h-[32px] " src={icon} alt=""/>
                                    </div>
                                    <a className="text-[16px] mb-1"
                                       href="https://github.com/nostr-protocol/nips/blob/master/50.md"
                                       target="_blank"
                                    >
                                        NIP-50 Search Capability
                                    </a>
                                </div>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};