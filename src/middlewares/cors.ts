import cors from 'cors';

const { NODE_ENV } = process.env;

export default cors(
  NODE_ENV === 'production'
    ? {
      origin: ['https://beagle-elgaeb.nomoredomains.rocks', 'http://beagle-elgaeb.nomoredomains.rocks'],
      credentials: true,
    }
    : {},
);
