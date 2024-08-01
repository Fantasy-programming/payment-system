const info = (...params: unknown[]): void => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...params);
  }
};

const error = (...params: unknown[]): void => {
  if (process.env.NODE_ENV !== "test") {
    if (params.length === 1) {
      const err = params[0];
      if (err instanceof Error) {
        console.error(err.message);
      }
    }

    console.error(...params);
  }
};

export default { info, error };
