const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

export const URL_TARGET: string = `${protocol}://${window.location.hostname}/`;


export const RELAYS_SET = [
    "wss://nos.lol/",
    "wss://relay.0xchat.com/",
    "wss://nfrelay.app/",
    "wss://relay.damus.io/",
    "wss://relayrs.notoshi.win/",
    "wss://relay.nexterz.com/",
    "wss://relay.notoshi.win/",
    "wss://fenrir-s.notoshi.win/",
    "wss://relay-fenrir.nexterz-sv.xyz/",
];