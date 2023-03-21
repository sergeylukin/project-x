import { sharedUtilAstrojsInject } from './shared-util-astrojs-inject';

describe('sharedUtilAstrojsInject', () => {
  it('should work', () => {
    expect(sharedUtilAstrojsInject()).toEqual('shared-util-astrojs-inject');
  });
});
