import { useState, useEffect } from 'react';

const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
        const start = text.substring(0, 10);
        const end = text.substring(text.length - 10);
        return `${start}.....${end}`;
    }
    return text;
};

export const RelayOperator = () => {
    const dataList = ["No Auth", "Free to Use", "Min PoW 30", "Max Limit 100", "Max Filter 100"];
    const longText = "npub1tmy6wf4stq3jyaza23x2zzyzxwnsrvrygdprpgfffwzeyga9qapqqyc5t6";
    const [copied, setCopied] = useState(false);

    const protocol = window.location.protocol.includes("https") ? "https" : "http";
    const endpoint = `${protocol}://${window.location.hostname}:6724/`;
    console.log(endpoint);

    useEffect(() => {
        fetch(endpoint, {
            method: 'GET',
            headers: {
                'Accept': 'application/nostr+json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Received data:", data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [endpoint]);

    const handleCopy = () => {
        navigator.clipboard.writeText(longText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <>
            <div id="relay-operator" className="mt-20 mb-10 flex flex-col items-center px-4">
                {/* Title */}
                <p className="text-xl sm:text-lg md:text-base font-bold mb-7 text-center text-gray-600">Relay Operator</p>

                {/* Card */}
                <div className="w-full max-w-sm sm:max-w-md lg:max-w-5xl flex flex-col lg:flex-row bg-white shadow-lg rounded-xl overflow-hidden">
                    {/* Profile Image */}
                    <div className="w-full lg:w-1/2">
                        <img
                            src="src/assets/profile.gif"
                            alt="Profile"
                            className="w-full h-auto lg:h-full object-cover"
                        />
                    </div>

                    {/* Card Content */}
                    <div className="w-full lg:w-1/2 px-6 py-6">
                        <h2 className="text-lg sm:text-base md:text-sm font-semibold text-gray-800">Headline</h2>
                        <h3 className="mt-1 mb-4 text-sm sm:text-xs md:text-[10px] text-gray-500 flex items-center">
                            {truncateText(longText, 50)}
                            <button
                                onClick={handleCopy}
                                className="text-[9px] ml-2 text-[#935CD1]"
                                aria-label="Copy to clipboard"
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </h3>
                        <p className="text-sm sm:text-xs md:text-[10px] text-gray-600 mb-4">
                            Please add your content here. Keep it short and simple. And smile :)
                        </p>

                        {/* Contact */}
                        <div className="border-t pt-4">
                            <p className="text-sm sm:text-xs md:text-[11px] font-semibold text-gray-800">Contact</p>
                            <p className="mt-1 text-sm sm:text-xs md:text-[10px] text-gray-600">lnwza007@rushmi0.win</p>
                        </div>

                        {/*
                        <div className="pt-2">
                            <p className="text-sm sm:text-xs md:text-[10px] font-semibold text-gray-800">Zap</p>
                            <p className="mt-1 text-sm sm:text-xs md:text-[10px] text-gray-600">lnwza007@rushmi0.win</p>
                        </div>
                        */}

                        {/* Policy */}
                        <div className="mt-4">
                            <p className="text-sm sm:text-xs md:text-[10px] font-semibold text-gray-800 mb-2">Policy</p>
                            <div className="flex flex-wrap gap-2">
                                {dataList.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-2 text-[7px] sm:text-[8px] text-white w-[8rem] h-[32px] bg-box-label bg-no-repeat bg-contain bg-center flex items-center justify-center"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};
