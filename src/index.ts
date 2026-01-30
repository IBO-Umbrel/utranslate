import fs from "fs/promises";



function htmlUnescape(s: string): string
{
    s = s.replace(/&#(\d+);/g, (_m, n) => String.fromCharCode(parseInt(n, 10)));
    s = s.replace(/&#x([0-9a-fA-F]+);/g, (_m, n) =>
        String.fromCharCode(parseInt(n, 16)),
    );
    const map: Record<string, string> = {
        quot: '"',
        apos: "'",
        amp: "&",
        lt: "<",
        gt: ">",
    };
    s = s.replace(/&([a-zA-Z]+);/g, (m, name) => map[name] ?? m);
    return s;
}


class Utranslate
{
    sourceLanguage: string;
    targetLanguage: string | string[];
    timeout: number;
    pattern: RegExp;

    constructor(
        sourceLanguage = "auto",
        targetLanguage: string | string[] = "tr",
        timeout = 5000,
    ) {
        this.sourceLanguage = sourceLanguage;
        this.targetLanguage = targetLanguage;
        this.timeout = timeout;
        this.pattern = /class="(?:t0|result-container)">(.*?)</s;
    }

    private async makeRequest(
        targetLanguage: string,
        sourceLanguage: string,
        text: string,
        timeout: number,
    ): Promise<string> {
        const escapedText = encodeURIComponent(text);
        const url = `https://translate.google.com/m?tl=${targetLanguage}&sl=${sourceLanguage}&q=${escapedText}`;

        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        let responseText = "";
        try {
            const res = await fetch(url, {
                signal: controller.signal,
                headers: { "User-Agent": "Mozilla/5.0" },
            } as any);
            responseText = await res.text();
        } catch (err) {
            throw new Error(`Request failed: ${err}`);
        } finally {
            clearTimeout(id);
        }

        const match = responseText.match(this.pattern);
        if (!match) {
            await fs.writeFile("error.txt", responseText).catch(() => {});
            throw new Error("Unknown error: could not parse translation");
        }

        return htmlUnescape(match[1]);
    }

    async translate(
        text: string,
        targetLanguage?: string | string[],
        sourceLanguage?: string,
        timeout?: number,
    ): Promise<string | string[]> {
        const tgt =
            typeof targetLanguage === "undefined"
                ? this.targetLanguage
                : targetLanguage;
        const src = sourceLanguage ?? this.sourceLanguage;
        const to = timeout ?? this.timeout;

        if (text.length > 5000) {
            throw new Error(
                `Error: It can only detect 5000 characters at once. (${text.length} characters found.)`,
            );
        }

        if (Array.isArray(tgt)) {
            return Promise.all(
                tgt.map((t) => this.makeRequest(t, src, text, to)),
            );
        }

        return this.makeRequest(tgt as string, src, text, to);
    }

    async translateFile(
        filePath: string,
        targetLanguage?: string | string[],
        sourceLanguage?: string,
        timeout?: number,
    ): Promise<string | string[]> {
        try {
            await fs.access(filePath);
        } catch {
            throw new Error("Error: The file or path is incorrect.");
        }

        const text = await fs.readFile(filePath, "utf8");
        return this.translate(text, targetLanguage, sourceLanguage, timeout);
    }
}



export default Utranslate;
export { Utranslate };