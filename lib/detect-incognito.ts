/**
 * Detects if the user is in Incognito/Private mode.
 * best-effort detection for modern browsers.
 */
export async function detectIncognito(): Promise<boolean> {
    if (typeof window === "undefined") return false

    // Safari (17+)
    // @ts-ignore
    if (typeof window.ApplePaySession !== "undefined") {
        try {
            // @ts-ignore
            const db = indexedDB.open("test");
            db.onerror = function () { return true; }
        } catch (e) {

        }
    }

    // Chrome / Chromium (FileSystem API quota)
    if ("storage" in navigator && "estimate" in navigator.storage) {
        const { quota } = await navigator.storage.estimate()
        // In Incognito, quota is significantly restricted (often < 120MB or specific proportion)
        // This is a heuristic, but common for Chrome Incognito.
        if (quota && quota < 120000000) return true
    }

    return false
}
