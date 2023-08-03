import FrozenServiceError from './Error/FrozenServiceError';
import UnknownIdError from './Error/UnknownIdError';

type Definition<T = any> = (c: Container) => T;
type Key = string;

export default class Container {
  private values: Record<Key, any> = {};

  private constructors: Record<Key, Definition> = {};

  private factories: Record<Key, true> = {};

  private frozen: Record<Key, true> = {};

  private definedKeys: Record<Key, true> = {};

  public raw(id: Key, value: any): void {
    if (this.frozen[id]) {
      throw new FrozenServiceError(id);
    }

    this.values[id] = value;
    this.definedKeys[id] = true;

    delete this.factories[id];
  }

  public set(id: Key, value: Definition): void {
    if (this.frozen[id]) {
      throw new FrozenServiceError(id);
    }

    this.constructors[id] = value;
    this.definedKeys[id] = true;

    delete this.factories[id];
  }

  public factory(id: Key, value: Definition) {
    this.set(id, value);
    this.factories[id] = true;
  }

  public remove(id: Key) {
    delete this.values[id];
    delete this.constructors[id];
    delete this.factories[id];
    delete this.definedKeys[id];
    delete this.frozen[id];
  }

  public get<T = any>(id: Key): T {
    if (!this.has(id)) {
      throw new UnknownIdError(id);
    }

    this.frozen[id] = true;

    if (this.values[id]) {
      return this.values[id];
    }

    if (this.factories[id]) {
      return this.constructors[id](this);
    }

    const value = this.constructors[id](this);
    this.values[id] = value;

    return value;
  }

  public has(id: Key): boolean {
    return this.definedKeys[id] === true;
  }

  public get keys(): string[] {
    return Object.keys(this.definedKeys);
  }
}
