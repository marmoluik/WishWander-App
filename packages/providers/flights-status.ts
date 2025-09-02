export type FlightStatusState =
  | "scheduled"
  | "active"
  | "delayed"
  | "cancelled"
  | "unknown";

export interface FlightStatus {
  id: string;
  state: FlightStatusState;
  departureTime?: string;
  arrivalTime?: string;
}

export interface FlightStatusProvider {
  /** Subscribe to updates for a flight. Returns an unsubscribe function. */
  subscribe(
    flightId: string,
    handler: (status: FlightStatus) => void
  ): () => void;
  /** Fetch the current status for a flight. */
  getStatus(flightId: string): Promise<FlightStatus>;
}

/**
 * Basic polling-based provider using a hypothetical external API.
 */
export class DefaultFlightStatusProvider implements FlightStatusProvider {
  private readonly apiKey: string;

  constructor(apiKey = process.env.FLIGHT_STATUS_API_KEY || "") {
    this.apiKey = apiKey;
  }

  async getStatus(flightId: string): Promise<FlightStatus> {
    try {
      const res = await fetch(
        `https://api.flightstatus.example.com/v1/flights/${flightId}?apiKey=${this.apiKey}`
      );
      if (!res.ok) {
        throw new Error(`status ${res.status}`);
      }
      const data = await res.json();
      return {
        id: flightId,
        state: (data.state as FlightStatusState) || "unknown",
        departureTime: data.departureTime,
        arrivalTime: data.arrivalTime,
      };
    } catch {
      return { id: flightId, state: "unknown" };
    }
  }

  subscribe(
    flightId: string,
    handler: (status: FlightStatus) => void
  ): () => void {
    const interval = setInterval(async () => {
      const status = await this.getStatus(flightId);
      handler(status);
    }, 60_000);
    return () => clearInterval(interval);
  }
}
