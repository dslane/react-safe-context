import * as React from 'react';

export type SafeContext<T> = {
  Consumer: React.FC<React.ConsumerProps<T>>;
  Provider: React.FC<React.ProviderProps<T>>;
  useValue: () => T;
};

const validateValue = <T,>(name: string, value: T | undefined): T => {
  if (value === undefined) {
    throw new Error(`value for ${name} was not initialized. Make sure the Provider is set up.`);
  }
  return value;
};

const safeConsumer = <T,>(
  name: string,
  Consumer: React.Context<T | undefined>['Consumer'],
): SafeContext<T>['Consumer'] => {
  const safeConsumer = (props: React.ConsumerProps<T>): React.ReactElement | null => (
    <Consumer>{value => props.children(validateValue(name, value))}</Consumer>
  );
  safeConsumer.$$typeof = Symbol('react.context');
  return safeConsumer;
};

const safeProvider = <T,>(Provider: React.Context<T | undefined>['Provider']): SafeContext<T>['Provider'] => {
  const safeProvider = (props: React.ProviderProps<T>): React.ReactElement | null => (
    <Provider value={props.value}>{props.children}</Provider>
  );
  safeProvider.$$typeof = Symbol('react.context');
  return safeProvider;
};

export default <T,>(name: string, initialValue?: T): SafeContext<T> => {
  const context = React.createContext(initialValue);
  return {
    ...context,
    Consumer: safeConsumer(name, context.Consumer),
    Provider: safeProvider(context.Provider),
    useValue: () => validateValue(name, React.useContext(context)),
  };
};
