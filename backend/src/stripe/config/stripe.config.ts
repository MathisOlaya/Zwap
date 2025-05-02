import Stripe from 'stripe';

import { HttpException, HttpStatus } from '@nestjs/common';

export const StripeConfig = () => {
  const STRIPE_PRIVATE_KEY = process.env.STRIPE_PRIVATE_KEY;

  if (STRIPE_PRIVATE_KEY === undefined) {
    throw new HttpException(
      'La clé stripe est manquante',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  return new Stripe(STRIPE_PRIVATE_KEY);
};
