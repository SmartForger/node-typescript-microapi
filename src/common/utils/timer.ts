export const delay = (ts: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ts);
  });
