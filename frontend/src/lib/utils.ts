export function cn(
    ...inputs: (string | undefined | null | false | Record<string, boolean>)[]
): string {
    return inputs
        .filter(Boolean)
        .map((input) => {
            if (typeof input === "string") return input;
            if (typeof input === "object" && input !== null) {
                return Object.entries(input)
                    .filter(([, val]) => Boolean(val))
                    .map(([key]) => key)
                    .join(" ");
            }
            return "";
        })
        .join(" ")
        .trim();
}
