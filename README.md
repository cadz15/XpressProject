To test local stripe

stripe listen --forward-to localhost:8000/api/stripe/webhook --events checkout.session.async_payment_succeeded,customer.subscription.updated,customer.subscription.deleted
