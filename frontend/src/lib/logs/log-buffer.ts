export type LogChunkResult = {
  lines: string[];
  remainder: string;
};

/**
 * Websocket text frames don't necessarily land on line boundaries, so we
 * buffer the trailing partial line across chunks. `remainder` is the
 * still-incomplete tail to prepend to the next chunk.
 */
export function ingestLogChunk(remainder: string, chunk: string): LogChunkResult {
  const combined = remainder + chunk;
  const parts = combined.split("\n");
  const newRemainder = parts.pop() ?? "";
  return { lines: parts, remainder: newRemainder };
}
