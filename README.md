To test local stripe

stripe listen --forward-to localhost:8000/api/stripe/webhook --events checkout.session.async_payment_succeeded,customer.subscription.updated,customer.subscription.deleted

REVERB_APP_ID=322947
REVERB_APP_KEY=g0lv88idkoszhoulzjkt
REVERB_APP_SECRET=dmlhqdhno0gsk3tog7fc
REVERB_HOST="localhost"
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
