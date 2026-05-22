export const storage = {
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  get(key: string) {
    const value = localStorage.getItem(key);

    if (!value) return null;

    return JSON.parse(value);
  },
};