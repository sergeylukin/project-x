import { sharedUtilsUrl } from './shared-utils-url';

describe('sharedUtilsUrl', () => {
  it('should work', () => {
    expect(sharedUtilsUrl()).toEqual('shared-utils-url');
  });
});
