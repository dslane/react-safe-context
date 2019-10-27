# react-safe-context
Create type-safe React context object with built-in undefined value handling, perfect for strict type-safe projects.

## Overview
- What is this?
- How to install?
- How to use?
- How does it work?

## What is this?
This package provides a wrapper around `React.createContext()` that allows creating a context who's value cannot be undefined, even without providing an initial value.

Normally, when using vanila React code to create a React context, the type of the context is inferred by the initial value passed to it
```typescript
// context1 will have type React.Context<string>
const context1 = React.createContext('value');

// context2 will have type React.Context<undefined>
const context2 = React.createContext(undefined);

// Typescript error in strict mode because string doesn't match undefined
const context3 = React.createContext<string>(undefined);

// context4 will have type React.Context<string | undefined>
const context4 = React.createContext<string | undefined>(undefined);
```
As you can see, this poses an issue if you want to create a context that starts without a value, but can only accept future values of a known type, such as `string`. You have to explicitly pass the generic type with `| undefined` in order to get it to all work out. But, when using strict typechecking, this poses a different problem:
```typescript
import * as React from 'react';

const context = React.createContext<string | undefined>(undefined);

class ClassComponent extends React.Component {
  public render() {
    return (
      <context.Consumer>
      {/* Error because toUpperCase() cannot be called on value since it may be undefined */}
      {value => <>{value.toUpperCase()}</>}
      </context.Consumer>
    );
  }
}

const FunctionComponent = () => {
  // Error because toUpperCase() cannot be called on value since it may be undefined
  return <>{React.useContext(context).toUpperCase()}</>
};

const component = (
  <context.Provider value="initial">
    <ClassComponent/>
    <FunctionComponent/>
  </context.Provider>
);
```

Since `context` is of type `React.Context<string | undefined>`, the value retrieved from it may be `undefined`, so you must first handle that case before treating it as a string. This becomes tedious as each context and use of a context that starts of uninitialized will have to do the same undefined-checking behavior.

This package aleviates that issue by allowing usage of uninitialized context objects without having to check for undefined values when consuming them. That's because it internally handles all the undefined checking.

## How to install?
Installation is just like any other npm package
```
yarn add react-safe-context
```
or
```
npm install react-safe-context
```

## How to use?
Usage is pretty simmilar to a standard React context. Here's the same example from above, but re-written with both use cases for react-safe-context:
```typescript
import * as React from 'react';
import {createSafeContext} from 'react-safe-context';

// if parameter is not passed, pass the desired value type in the Generic
const context1 = createSafeContext<string>('Context1');
// if parameter is passed, no need to provide the type explicitly
const context2 = createSafeContext('Context2', "initialValue");

class ClassComponent extends React.Component {
  public render() {
    return (
      <>
        <context1.Consumer>
          {value => <>{value.toUpperCase()}</>}
        </context1.Consumer>
        <context2.Consumer>
          {value => <>{value.toUpperCase()}</>}
        </context2.Consumer>
      </>
    );
  }
}

const FunctionComponent = () => (
  <>
    {context1.useValue().toUpperCase()}
    {context2.useValue().toUpperCase()}
  </>
);

const component = (
  <context.Provider value="delayedValue">
    <ClassComponent/>
    <FunctionComponent/>
  </context.Provider>
);
```
The key differences are:
- `createSafeContext()` instead of `React.createContext()`
  - The first parameter to createSafeContext is a name for the context. This is used in the error that gets thrown if the value is not initialized.
  - Can leave off the second parameter instead of passing `undefined` in order to avoid setting an initial value
    - If so, generic type of the context must be provided
- `context.useValue()` instead of `React.useContext(context)`
  - Since the created object isn't a true React context object, it can't be used with `React.useContext`
  
## What about exceptions?
If no initial value is set and no provider is created to set a vlaue, then it's still necessary to throw an error, otherwise consumers of the context could cause runtime exceptions. If the Conumser or custom hook is used without value being set, an error will be thrown:
```
value for ${name} was not initialized. Make sure the Provider is set up.
```
where `name` is the first parameter passed when the safe context was created. This can be handled with a React ErrorBoundary component, as is typical with errors in React's VirtualDOM.
