import icon from "../assets/icon.svg";
import * as React from "react";

type SlideItem = {
  title: string;
  link: string;
};

const items: SlideItem[] = [
  {
    title: "NIP-01 Basic Protocol Flow",
    link: "https://github.com/nostr-protocol/nips/blob/master/01.md",
  },
  {
    title: "NIP-02 Follow List",
    link: "https://github.com/nostr-protocol/nips/blob/master/02.md",
  },
  {
    title: "NIP-04 Encrypted Direct Messages",
    link: "https://github.com/nostr-protocol/nips/blob/master/04.md",
  },
  {
    title: "NIP-09 Event Deletion",
    link: "https://github.com/nostr-protocol/nips/blob/master/09.md",
  },
  {
    title: "NIP-11 Relay Information",
    link: "https://github.com/nostr-protocol/nips/blob/master/11.md",
  },
  {
    title: "NIP-13 Proof of Work",
    link: "https://github.com/nostr-protocol/nips/blob/master/13.md",
  },
  {
    title: "NIP-15 Marketplace",
    link: "https://github.com/nostr-protocol/nips/blob/master/15.md",
  },
  {
    title: "NIP-28 Public Chat",
    link: "https://github.com/nostr-protocol/nips/blob/master/28.md",
  },
  {
    title: "NIP-45 Event Counts",
    link: "https://github.com/nostr-protocol/nips/blob/master/45.md",
  },
  {
    title: "NIP-50 Search Capability",
    link: "https://github.com/nostr-protocol/nips/blob/master/50.md",
  },
];

export const SlideShow = () => {
  return (
    <div className="mt-10">
      <div
        className="slider"
        style={
          {
            "--width": "600px",
            "--height": "64px",
            "--quantity": items.length,
          } as React.CSSProperties
        }
      >
        <div className="list">
          {items.map((item, index) => (
            <div
              key={item.title}
              className="item"
              style={{ ["--position" as unknown as number]: index + 1 }}
            >
              <div className="bg-slideshow">
                <div className="flex justify-center items-center">
                  <div className="w-[50px]">
                    <img className="w-[32px] h-[32px]" src={icon} alt="" />
                  </div>

                  <a
                      className="text-[21px] mb-1 leading-none hover:text-[#935cd1] transition"
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.title}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
