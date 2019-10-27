import * as React from 'react';
import { mount } from 'enzyme';
import { createSafeContext } from '../src/createSafeContext';

describe('createSafeContext', () => {
  const contextName = 'TestContext';
  const getContext = <T,>(initialValue?: T) => createSafeContext<T>(contextName, initialValue);

  describe('when no Provider is set', () => {
    describe('and there is no initial value', () => {
      beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
      });

      it('throws an error when using the Consumer', () => {
        const { Consumer } = getContext();
        const renderConsumer = () => mount(<Consumer>{_ => fail('Consumer should not render children')}</Consumer>);
        expect(renderConsumer).toThrowError(
          `value for ${contextName} was not initialized. Make sure the Provider is set up.`,
        );
      });

      it('throws an error when using the hook', () => {
        const { useValue } = getContext<unknown>();
        const Wrapper = () => {
          const value = useValue();
          fail('hook should not succeed');
          return <>{value}</>;
        };
        const renderHook = () => mount(<Wrapper />);
        expect(renderHook).toThrowError(
          `value for ${contextName} was not initialized. Make sure the Provider is set up.`,
        );
      });
    });

    describe('and there is an initial value', () => {
      const initialValue = 'val';
      const getInitializedContext = () => getContext(initialValue);

      it('passes the provided value when using the Consumer', () => {
        const { Consumer } = getInitializedContext();
        const renderConsumer = () => mount(<Consumer>{value => value}</Consumer>);
        expect(renderConsumer().text()).toEqual(initialValue);
      });

      it('passes the provided value when using the hook', () => {
        const { useValue } = getInitializedContext();
        const Wrapper = () => <>{useValue()}</>;
        const renderHook = () => mount(<Wrapper />);
        expect(renderHook().text()).toEqual(initialValue);
      });
    });
  });

  describe('when provider is set', () => {
    const providedValue = 'provided';

    it('passes the provided value when using the Consumer', () => {
      const { Consumer, Provider } = getContext<typeof providedValue>();
      const renderConsumer = () =>
        mount(
          <Provider value={providedValue}>
            <Consumer>{value => value}</Consumer>
          </Provider>,
        );
      expect(renderConsumer().text()).toEqual(providedValue);
    });

    it('passes the provided value when using the hook', () => {
      const { useValue, Provider } = getContext<typeof providedValue>();
      const Wrapper = () => <>{useValue()}</>;
      const renderHook = () =>
        mount(
          <Provider value={providedValue}>
            <Wrapper />
          </Provider>,
        );
      expect(renderHook().text()).toEqual(providedValue);
    });
  });
});
