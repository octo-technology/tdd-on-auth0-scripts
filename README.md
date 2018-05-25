# tdd-on-auth0-scripts
How to TDD on Auth0 scripts

## GitHub deployment

The GitHub Deployments [extension](https://auth0.com/docs/extensions/github-deploy) allows you to deploy rules and database connection scripts 
from GitHub to Auth0. You can configure a GitHub repository, keep all your rules and database connection scripts there, 
and have them automatically deployed to Auth0 each time you push to your repository.

There is also extensions for [GitLab](https://auth0.com/docs/extensions/gitlab-deploy) or [Bitbucket](https://auth0.com/docs/extensions/bitbucket-deploy)

## Problem for unit tests

The problem with the extensions conventions is that the scripts can only contain a function.
You can't modularize or add an export in the script.

Auth0 offers [several testing strategies](https://auth0.com/docs/support/testing) but not realy for Unit Tests.

And I need TDD to express behaviours of my scripts.

## Solution to TDD

The solution is to add these lines in your tests :

```javascript
  const mockedDependancy = require('some_dependency');

  const fs = require('fs');
  const scriptSource = fs.readFileSync('<path_of_the_source_script>', 'utf8');
  const testableScript = new Function('one_dependency', 'return ' + scriptSource + ';');
  const functionToUseInTests = testableScript(mockedDependancy);
```

These lines :

1. read the script through the file system
2. inject it in a new function with its dependencies (aka a closure)
3. eval the closure with the mocked dependencies

So now you can TDD \o/

## Run unit tests

```shell
npm test
```

## Run linter

```shell
npm run lint
```

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, among others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free Auth0 account

1. Go to [Auth0](https://auth0.com/signup) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.
