import { sharedUtilConfigProvider } from './shared-util-config-provider';

describe('sharedUtilConfigProvider', () => {
  it('should work', () => {
    expect(sharedUtilConfigProvider()).toEqual('shared-util-config-provider');
  });
});
