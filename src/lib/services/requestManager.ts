class RequestManager {
  private controllers = new Map<string, AbortController>();

  create(key: string) {
    this.cancel(key);

    const controller = new AbortController();

    this.controllers.set(key, controller);

    return controller;
  }

  cancel(key: string) {
    const existing = this.controllers.get(key);

    if (existing) {
      existing.abort();
      this.controllers.delete(key);
    }
  }
}

export const requestManager = new RequestManager();