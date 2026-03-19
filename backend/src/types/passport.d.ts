declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      [key: string]: any;
    }
  }
}

export {};
