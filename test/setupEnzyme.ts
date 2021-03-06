/* eslint-disable @typescript-eslint/no-explicit-any */
import { configure } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { JSDOM } from 'jsdom';

configure({ adapter: new EnzymeAdapter() });

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src: unknown, target: unknown) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

(global as any).window = window;
(global as any).document = window.document;
(global as any).navigator = {
  userAgent: 'node.js',
};
(global as any).requestAnimationFrame = function(callback: Parameters<typeof setTimeout>[0]) {
  return setTimeout(callback, 0);
};
(global as any).cancelAnimationFrame = function(id: Parameters<typeof clearTimeout>[0]) {
  clearTimeout(id);
};
copyProps(window, global as any);
