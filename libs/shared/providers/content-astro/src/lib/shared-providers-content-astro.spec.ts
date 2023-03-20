import { sharedProvidersContentAstro } from './shared-providers-content-astro';

describe('sharedProvidersContentAstro', () => {
  it('should work', () => {
    expect(sharedProvidersContentAstro()).toEqual(
      'shared-providers-content-astro'
    );
  });
});
