import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  expiresIn: process.env.JWT_EXPIRATION || '12h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));

