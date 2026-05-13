export function toAbsoluteUrl(input: string, site?: URL) {
  try {
    if (input.startsWith('http://') || input.startsWith('https://')) return input;
    if (!site) return input;
    return new URL(input, site).toString();
  } catch {
    return input;
  }
}

