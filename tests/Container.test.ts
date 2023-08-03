import Container from '../src/Container';
import FrozenServiceError from '../src/Error/FrozenServiceError';
import UnknownIdError from '../src/Error/UnknownIdError';

describe('Dinjectease container', () => {
  it('throws error for undefined key', () => {
    const c = new Container();
    expect(() => c.get('test')).toThrow(UnknownIdError);
  });

  it('sets raw value', () => {
    const c = new Container();
    c.raw('test', 'foo');

    expect(c.get('test')).toStrictEqual('foo');
  });

  it('sets service definition', () => {
    const value = { test: 'test' };
    const definition = jest.fn(() => value);
    const c = new Container();

    c.set('test', definition);

    const result = c.get('test');

    expect(definition).toHaveBeenCalledWith(c);
    expect(result).toBe(value);
  });

  it('does not call service definition twice', () => {
    const value = { test: 'test' };
    const definition = jest.fn(() => value);
    const c = new Container();

    c.set('test', definition);

    c.get('test');
    const result = c.get('test');

    expect(definition).toHaveBeenCalledWith(c);
    expect(definition).toHaveBeenCalledTimes(1);

    expect(result).toBe(value);
  });

  it('always calls factory service definition', () => {
    const Value = class {};
    const definition = jest.fn(() => new Value());
    const c = new Container();

    c.factory('test', definition);

    const result1 = c.get('test');
    const result2 = c.get('test');

    expect(definition).toHaveBeenCalledWith(c);
    expect(definition).toHaveBeenCalledTimes(2);

    expect(result1).toBeInstanceOf(Value);
    expect(result2).toBeInstanceOf(Value);

    expect(result1).not.toBe(result2);
  });

  it.each<['raw', string] | [('set' | 'factory'), () => string]>([
    ['raw', 'test'],
    ['set', () => 'test'],
    ['factory', () => 'test'],
  ])('prevents from setting id if it is already frozen (%s)', (method, value) => {
    const c = new Container();

    // @ts-ignore
    c[method]('test', value);

    c.get('test');

    // @ts-ignore
    expect(() => c[method]('test', value)).toThrow(FrozenServiceError);
  });

  it('returns list of all defined ids', () => {
    const c = new Container();

    c.raw('raw', 'test');
    c.set('set', () => 'test');
    c.factory('factory', () => 'test');

    expect(c.keys).toHaveLength(3);
    expect(c.keys).toContain('raw');
    expect(c.keys).toContain('set');
    expect(c.keys).toContain('factory');
  });

  it('removes id', () => {
    const c = new Container();

    c.raw('raw', 'test');
    c.set('set', () => 'test');
    c.factory('factory', () => 'test');

    c.get('raw');
    c.get('set');
    c.get('factory');

    c.remove('raw');
    expect(c.keys).not.toContain('raw');
    expect(() => c.get('raw')).toThrow();
    expect(c.keys).toHaveLength(2);

    c.remove('set');
    expect(c.keys).not.toContain('set');
    expect(() => c.get('set')).toThrow();
    expect(c.keys).toHaveLength(1);

    c.remove('factory');
    expect(c.keys).not.toContain('factory');
    expect(() => c.get('factory')).toThrow();
    expect(c.keys).toHaveLength(0);
  });

  it('returns valid boolean for "has" check', () => {
    const c = new Container();

    c.raw('raw', 'test');
    c.set('set', () => 'test');
    c.factory('factory', () => 'test');

    expect(c.has('raw')).toStrictEqual(true);
    expect(c.has('set')).toStrictEqual(true);
    expect(c.has('factory')).toStrictEqual(true);
    expect(c.has('unknown')).toStrictEqual(false);
  });
});
