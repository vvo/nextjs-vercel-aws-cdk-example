// All those env variables should be set
// Note: if you're on Vercel, you cannot add `AWS_ACCESS_KEY_ID`,
// see https://vercel.com/docs/platform/limits#reserved-variables

export const awsAccessKeyId = process.env.SECRET_AWS_ACCESS_KEY_ID;
export const awsSecretAccessKey = process.env.SECRET_AWS_SECRET_ACCESS_KEY;
export const awsRegion = process.env.SECRET_AWS_REGION;

export const domain = process.env.DOMAIN;

export const appEnv = process.env.APP_ENV;
