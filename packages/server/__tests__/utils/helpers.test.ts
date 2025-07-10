import { getS3PublicUrl, createUniqueFileKey } from '../../src/utils/helpers';

jest.mock('nanoid', () => ({
  nanoid: jest.fn().mockReturnValue('test123')
}));

describe('helpers', () => {
  describe('getS3PublicUrl', () => {
    it('should generate correct S3 public URL', () => {
      const result = getS3PublicUrl({
        bucket: 'asset-bucket',
        region: 'us-east-2',
        key: 'screenshot_from_2023-01-13_10-30-00.png'
      });
      expect(result).toBe('https://asset-bucket.s3.us-east-2.amazonaws.com/screenshot_from_2023-01-13_10-30-00.png');
    });
  });

  describe('createUniqueFileKey', () => {
    it('should create a valid file key with prefix', () => {
      const result = createUniqueFileKey({
        name: 'screenshot _from_2023-01-13_10-30-00.final.png',
        prefix: 'uploads'
      });
      expect(result).toBe('uploads/screenshot_from_2023-01-13_10-30-00final-test123.png');
    });

    it('should handle special characters in filename', () => {
      const result = createUniqueFileKey({
        name: 'test@file#name (1).jpg',
        prefix: 'uploads'
      });
      expect(result).toBe('uploads/testfilename1-test123.jpg');
    });

    it('should preserve hyphens and underscores', () => {
      const result = createUniqueFileKey({
        name: 'screenshot_@from_2023-01-13_10-30-00.png',
        prefix: 'uploads'
      });
      expect(result).toBe('uploads/screenshot_from_2023-01-13_10-30-00-test123.png');
    });

    it('should handle empty filename', () => {
      const result = createUniqueFileKey({
        name: '.jpg',
        prefix: 'uploads'
      });
      expect(result).toBe('uploads/test123-test123.jpg');
    });
  });
});
