/**
 * Simple pub/sub event bus
 */

type EventCallback<T = unknown> = (data: T) => void;

interface EventSubscription {
  callback: EventCallback;
  once: boolean;
}

/**
 * EventBus provides a simple pub/sub mechanism for plugin communication
 */
export class EventBus {
  private events: Map<string, EventSubscription[]> = new Map();

  /**
   * Subscribe to an event
   * @param event Event name
   * @param callback Callback function
   * @returns Unsubscribe function
   */
  on<T = unknown>(event: string, callback: EventCallback<T>): () => void {
    const subscription: EventSubscription = {
      callback: callback as EventCallback,
      once: false,
    };

    const subscribers = this.events.get(event) || [];
    subscribers.push(subscription);
    this.events.set(event, subscribers);

    return () => this.off(event, callback);
  }

  /**
   * Subscribe to an event only once
   * @param event Event name
   * @param callback Callback function
   * @returns Unsubscribe function
   */
  once<T = unknown>(event: string, callback: EventCallback<T>): () => void {
    const subscription: EventSubscription = {
      callback: callback as EventCallback,
      once: true,
    };

    const subscribers = this.events.get(event) || [];
    subscribers.push(subscription);
    this.events.set(event, subscribers);

    return () => this.off(event, callback);
  }

  /**
   * Emit an event
   * @param event Event name
   * @param data Event data
   */
  emit<T = unknown>(event: string, data?: T): void {
    const subscribers = this.events.get(event);
    if (!subscribers) return;

    const remainingSubscribers: EventSubscription[] = [];

    subscribers.forEach((subscription) => {
      subscription.callback(data);
      if (!subscription.once) {
        remainingSubscribers.push(subscription);
      }
    });

    if (remainingSubscribers.length > 0) {
      this.events.set(event, remainingSubscribers);
    } else {
      this.events.delete(event);
    }
  }

  /**
   * Unsubscribe from an event
   * @param event Event name
   * @param callback Callback function to remove
   */
  off<T = unknown>(event: string, callback: EventCallback<T>): void {
    const subscribers = this.events.get(event);
    if (!subscribers) return;

    const filtered = subscribers.filter((s) => s.callback !== callback);

    if (filtered.length > 0) {
      this.events.set(event, filtered);
    } else {
      this.events.delete(event);
    }
  }

  /**
   * Clear all event subscriptions
   */
  clear(): void {
    this.events.clear();
  }
}

/**
 * Shared event bus instance
 */
export const eventBus = new EventBus();
