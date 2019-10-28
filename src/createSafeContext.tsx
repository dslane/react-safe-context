import * as React from 'react';

/**
 * Wrapper for React Context that does not allow undefined values
 */
export type SafeContext<T> = {
  /** Consumer component for the context */
  Consumer: React.ComponentType<React.ConsumerProps<T>>;
  /** Provider component for the context */
  Provider: React.ComponentType<React.ProviderProps<T>>;
  /** Custom hook to get the context's value */
  useValue: () => T;
};

const validateValue = <T,>(name: string, value: T | undefined): T => {
  if (value === undefined) {
    throw new Error(`value for ${name} was not initialized. Make sure the Provider is set up.`);
  }
  return value;
};

const safeConsumer = <T,>(name: string, context: React.Context<T | undefined>) => (props: React.ConsumerProps<T>) => (
  <context.Consumer>{value => props.children(validateValue(name, value))}</context.Consumer>
);

const safeProvider = <T,>(context: React.Context<T | undefined>) => (props: React.ProviderProps<T>) => (
  <context.Provider value={props.value}>{props.children}</context.Provider>
);

/**
 * Creates an object that wraps a React Context and provides non-undefined values via the consumer and a custom hook. Also
 * prevents providing undefined as a value to the provider
 *
 * @export
 * @typeparam T The type of value the context should hold
 * @param {string} name The name of the context, used when no value is provided
 * @param {T} initialValue Optional initial value to store in the context
 * @returns {SafeContext<T>} The context wrapper, containing Consumer and Provider components, as well as a custom hook
 */
export const createSafeContext = <T,>(name: string, initialValue?: T): SafeContext<T> => {
  const context = React.createContext(initialValue);
  return {
    Consumer: safeConsumer(name, context),
    Provider: safeProvider(context),
    useValue: () => validateValue(name, React.useContext(context)),
  };
};
