import * as React from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import { createSafeContext } from './createSafeContext';

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
        const renderConsumer = () => render(<Consumer>{(_) => fail('Consumer should not render children')}</Consumer>);
        expect(renderConsumer).toThrowError(
          `value for ${contextName} was not initialized. Make sure the Provider is set up.`,
        );
      });

      it('throws an error when using the hook', () => {
        const { useValue } = getContext<unknown>();
        expect(() => renderHook(useValue)).toThrowError(
          `value for ${contextName} was not initialized. Make sure the Provider is set up.`,
        );
      });
    });

    describe('and there is an initial value', () => {
      const initialValue = 'val';
      const getInitializedContext = () => getContext(initialValue);

      it('passes the provided value when using the Consumer', () => {
        const { Consumer } = getInitializedContext();
        render(<Consumer>{(value) => value}</Consumer>);
        expect(screen.getByText(initialValue)).toBeInTheDocument();
      });

      it('passes the provided value when using the hook', () => {
        const { useValue } = getInitializedContext();
        expect(renderHook(useValue).result.current).toBe(initialValue);
      });
    });
  });

  describe('when provider is set', () => {
    const providedValue = 'provided';

    it('passes the provided value when using the Consumer', () => {
      const { Consumer, Provider } = getContext<typeof providedValue>();
      render(
        <Provider value={providedValue}>
          <Consumer>{(value) => value}</Consumer>
        </Provider>,
      );
      expect(screen.getByText(providedValue)).toBeInTheDocument();
    });

    it('passes the provided value when using the hook', () => {
      const { useValue, Provider } = getContext<typeof providedValue>();
      expect(
        renderHook(useValue, {
          wrapper: ({ children }) => <Provider value={providedValue}>{children}</Provider>,
        }).result.current,
      ).toBe(providedValue);
    });
  });
});
