import { Sha256 } from '@aws-crypto/sha256-browser';

export class NostrEvent {
    pubkey: string;
    created_at: number;
    kind: number;
    tags: string[][];
    content: string;
    public id: string;

    private constructor(pubkey: string, created_at: number, kind: number, tags: string[][], content: string, id: string) {
        this.pubkey = pubkey;
        this.created_at = created_at;
        this.kind = kind;
        this.tags = tags;
        this.content = content;
        this.id = id;
    }

    static async create({ pubkey, created_at, kind, tags, content }: {
        pubkey: string,
        created_at: number,
        kind: number,
        tags: string[][],
        content: string
    }): Promise<NostrEvent> {
        const id = await NostrEvent.generateId(pubkey, created_at, kind, tags, content);
        return new NostrEvent(pubkey, created_at, kind, tags, content, id);
    }

    private static async generateId(pubkey: string, created_at: number, kind: number, tags: string[][], content: string): Promise<string> {
        const eventJson = JSON.stringify([
            0,
            pubkey.toLowerCase(),
            created_at,
            kind,
            tags,
            content
        ]);
        return await NostrEvent.sha256(eventJson);
    }

    private static async sha256(data: string): Promise<string> {
        const hash = new Sha256();
        hash.update(data);
        const hashBuffer = await hash.digest();
        return Array.from(new Uint8Array(hashBuffer))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }
}
