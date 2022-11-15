
export interface HookCallbacks {
  init: (promise: Promise<unknown>) => void 
  before: (promise: Promise<unknown>) => void 
  after: (promise: Promise<unknown>) => void 
  resolve: (promise: Promise<unknown>) => void 
}

const enabledCallbacks = new Set<HookCallbacks>();

// @ts-ignore: Deno.core allowed
Deno.core.setPromiseHooks(
  (promise: Promise<unknown>, _parentPromise?: Promise<unknown>) => {
    for (const { init } of enabledCallbacks) {
      init(promise);
    }
  },
  (promise: Promise<unknown>) => {
    for (const { before } of enabledCallbacks) {
      before(promise);
    }
  },
  (promise: Promise<unknown>) => {
    for (const { after } of enabledCallbacks) {
      after(promise);
    }
  },
  (promise: Promise<unknown>) => {
    for (const { resolve } of enabledCallbacks) {
      resolve(promise);
    }
  },
);

export class AsyncHooksContextManager<T> {
  
  #contexts: Map<Promise<unknown>, T> = new Map();
  
  #stack: Array<T | undefined> = [];
  
  #callbacks: HookCallbacks = {
    init: (promise) => {
      const context = this.#stack[this.#stack.length - 1];
      if (context !== undefined) {
        this.#contexts.set(promise, context);
      }
    },
    before: (promise) => { 
      const context = this.#contexts.get(promise);
      if (context !== undefined) {
        this._enterContext(context);
      }
    },
    after: () => {
      this._exitContext();
    },
    resolve: (promise) => {
      this.#contexts.delete(promise);
    }
  }

  active(): T {
    const context = this.#stack[this.#stack.length - 1];
    if (context === undefined) {
      throw new Error("context is null!");
    }
    return context;
  }
  
  maybeActive(): T | undefined {
    const context = this.#stack[this.#stack.length - 1];
    return context;
  }

  run<A extends unknown[], F extends (...args: A) => ReturnType<F>>(
    context: T,
    fn: F,
    thisArg?: ThisParameterType<F>,
    ...args: A
  ): ReturnType<F> {
    this._enterContext(context);
    try {
      return fn.call(thisArg!, ...args);
    } finally {
      this._exitContext();
    }
  }

  enable() {
    enabledCallbacks.add(this.#callbacks);
  }

  disable() {
    enabledCallbacks.delete(this.#callbacks);
    this.#contexts.clear();
    this.#stack = [ ];
  }

  private _enterContext(context: T) {
    this.#stack.push(context);
  }

  private _exitContext() {
    this.#stack.pop();
  }
}
