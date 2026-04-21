export default class EventService {
  private id = 0;
  private listeners = new Map<number, (event: unknown) => void>();

  sub(callback: (event: unknown) => void): () => void {
    this.id += 1;
    const listenId = this.id;

    this.listeners.set(listenId, callback);

    return () => this.unsub(listenId);
  }

  unsub(id: number): void {
    this.listeners.delete(id);
  }

  trigger(event: unknown): void {
    this.listeners.forEach((callback) => callback(event));
  }
}