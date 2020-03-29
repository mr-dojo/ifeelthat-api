# Listen/Share API

This is an express API for the Listen/Share react app (ifeelthat)

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

Seeding databases

- Seed ifeelthat `psql -U carlo -d ifeelthat -f ./seeds/seed.ifeelthat.sql`
- Seed ifeelthat test `psql -U carlo -d ifeelthattest -f ./seeds/seed.ifeelthat.sql`

## Deploying

You can run `npm run deploy` which will push to this remote's master branch, deploying the website.
