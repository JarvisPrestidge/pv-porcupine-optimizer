<p align="center">
    <img src="./docs/refreshing.jpg" />
    <br>
    <br>
	<sup><strong>mmm... so refreshing</strong></sup>
</p>

# Refresh Tester

K8s cron job for testing refresh tokens

* Refreshes a list of refresh token on a 5 min interval
* Alerts to slack (`#data-connectivity` channel) when a refresh fails with supporting info

## Slack Alert

![example](./docs/example.png)

## Adding Tokens

To add more tokens to the database containing the list to be refreshed, you can use the helper script `./scripts/add-token.ts` by configuring the necessary 4 fields:
* accessToken
* refreshToken
* credentialsId
* providerId

Then running the script via
```bash
$ yarn add-token
```

> the project must be correctly configured with the appropriate environment variables - see below

## Secrets

Project expects the following environment variable to run locally.

```
NODE_ENV=development

# Database
DB_USERNAME=""
DB_PASSWORD=""
DB_PORT=""
DB_DATABASE=""
DB_HOST=""

# Slack
SLACK_TOKEN=""
SLACK_CHANNEL=""

# TrueLayer
CLIENT_ID=""
CLIENT_SECRET=""
```


