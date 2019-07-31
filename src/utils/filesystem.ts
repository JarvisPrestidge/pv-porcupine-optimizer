export type Arch = "x86_64" | "amd64";
export type Platform = "linux" | "mac" | "windows";

export const platformToArchMap = new Map<Platform, Arch>([
    ["linux", "x86_64"],
    ["mac", "x86_64"],
    ["windows", "amd64"]
]);

export const osTypeToPlatformMap = new Map<string, Platform>([
    ["Linux", "linux"],
    ["Darwin", "mac"],
    ["Windows_NT", "windows"]
]);
