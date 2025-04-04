import type {WindowNostr} from "nostr-tools/nip07";
import {EventTemplate, NostrEvent} from "nostr-tools/core";

declare global {
    interface Window {
        nostr?: WindowNostr;
    }
}


export async function getPublicKey(): Promise<string> {
    if (!window.nostr) throw new Error("Nostr extension is not available");
    return await window.nostr.getPublicKey();
}


export async function signEvent(event: EventTemplate): Promise<NostrEvent> {
    if (!window.nostr) throw new Error("Nostr extension is not available");
    return await window.nostr.signEvent(event);
}


export async function nip44Encrypt(pubkey: string, plaintext: string): Promise<string> {
    if (!window.nostr?.nip44) throw new Error("NIP-44 is not supported");
    return await window.nostr.nip44.encrypt(pubkey, plaintext);
}


export async function nip44Decrypt(pubkey: string, ciphertext: string): Promise<string> {
    if (!window.nostr?.nip44) throw new Error("NIP-44 is not supported");
    return await window.nostr.nip44.decrypt(pubkey, ciphertext);
}
