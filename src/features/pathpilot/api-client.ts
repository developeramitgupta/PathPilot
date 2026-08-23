export class PathPilotApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "PathPilotApiError";
  }
}

export async function requestPathPilot<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new PathPilotApiError(
      payload.error ?? "PathPilot could not complete that request.",
      response.status,
    );
  }
  return payload;
}
