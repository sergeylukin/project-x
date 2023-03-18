import { sharedContainerContainer } from './shared-container-container';

describe('sharedContainerContainer', () => {
  it('should work', () => {
    expect(sharedContainerContainer()).toEqual('shared-container-container');
  });
});
