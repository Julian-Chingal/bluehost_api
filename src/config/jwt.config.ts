export const ACCESS_TOKEN = process.env.ACCESS_TOKEN || 'default_access_secret';
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN || 'default_refresh_secret';

export const ACCESS_TOKEN_EXPIRES_IN = Number(process.env.ACCESS_TOKEN_EXPIRES_IN) || 60; 
export const REFRESH_TOKEN_EXPIRES_IN = Number(process.env.REFRESH_TOKEN_EXPIRES_IN) || 1440;