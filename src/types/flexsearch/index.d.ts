declare module "flexsearch" {

  interface DocOptions {
    id: string;
    field: string | Array<string> | object;
  }

  interface Options {
    encode?: string;
    tokenize?: string;
    threshold?: number;
    async?: boolean;
    worker?: boolean;
    cache?: boolean;
    doc?: DocOptions;
  }

  class FlexSearch<T> {
    constructor(mode: string, options?: Options);
    constructor(options?: Options);
    constructor();

    add(id: number, value: string): void;
    add(data: T): void;
    search(s: string, limit?: number, callback?: (result: Array<T>) => void): Array<T>;
    update(id: number, value: string): void;
    remove(id: number): void;
    clear(): void;
    destroy(): void;
    init(options?: options): void;
    find(id: number): object;

    static create(options?: options): FlexSearch;
  }

  export = FlexSearch;
}