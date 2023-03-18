import { sharedUtilsEnvironment } from './shared-utils-environment';

describe('sharedUtilsEnvironment', () => {
  it('should work', () => {
    expect(sharedUtilsEnvironment()).toEqual('shared-utils-environment');
  });
});
