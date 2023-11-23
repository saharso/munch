export default function wait(by = 36) {
  return new Promise<unknown>((resolve: (value: unknown) => void) => {
    setTimeout(() => {
      resolve(null);
    }, by);
  });
}
