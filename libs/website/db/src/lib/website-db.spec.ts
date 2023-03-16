import { websiteDb } from './website-db';

describe('websiteDb', () => {
  it('should work', () => {
    expect(websiteDb()).toEqual('website-db');
  });
});
