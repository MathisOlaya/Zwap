import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Stripe
import Stripe from 'stripe';
import { StripeConfig } from './config/stripe.config';

// Database model
import { User } from '@prisma/client';

@Injectable()
export class StripeService {
  // Stripe variable
  private stripe: Stripe;

  constructor() {
    this.stripe = StripeConfig();
  }
}
