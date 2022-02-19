export default function appendBin() {
  return {
    name: "appendBin", // this name will show up in warnings and errors
    renderChunk: (code) => `#!/usr/bin/env node \n${code}`,
  };
}
