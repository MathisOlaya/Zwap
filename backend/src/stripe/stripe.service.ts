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

  async createUser(User: User): Promise<Stripe.Customer> {
    const customer: Stripe.Customer = await this.stripe.customers.create({
      name: User.firstname,
      email: User.email,
      metadata: {
        user_id: User.id,
      },
    });

    return customer;
  }

}
