# Dinjectease

📦 Tiny DI container to control **d**ependency **inject**ion with **ease**.

The project has been inspired heavily by [Pimple](https://github.com/silexphp/Pimple).

[![codecov](https://codecov.io/gh/rzeczkowskip/dinjectease/branch/main/graph/badge.svg?token=N1RDC9NCL9)](https://codecov.io/gh/rzeczkowskip/dinjectease)
![GitHub commit checks state](https://img.shields.io/github/checks-status/rzeczkowskip/dinjectease/main)

# Getting started

## Installation

Install `dinjectease` from npm:

```shell
npm install dinjectease
```

## Usage

To create a container, initialize the `Container` class:

```js
import Container from 'dinjectease';

const container = new Container();
```

Dinjectease supports different types of values: services (initialized once on first fetch),
factories (initialized on each fetch) and raw values (returned as defined).

### Defining raw values

Raw values are a great way to define the configuration values to be usable from the container. You can store any value,
starting from configuration strings, through objects and arrays to callables or whole class instances.

Raw values are saved as provided. 

```js
container.raw('app_name', 'Dinjectease');
container.raw('default_lang', 'en');
```

### Defining services

Services are defined using a callback:

```typescript
type Definition<T = any> = (c: Container) => T;
```

When a service is fetched from the container, always the same instance is returned. If the instance doesn't exist,
it is created by calling the provided callback.

The definition takes current container instance as the only argument.

```js
container.raw('mailer_transport', 'gmail');
container.set('mailer', (c) => new MailerService(c.get('mailer_transport')));
```

Now every call to `container.get('mailer')` returns same instance of the MailerService.

### Defining factories

By default, all services are created only once. If you want to have an instance created every time the service is
fetched, use the `factory` method instead of `set`.

```js
container.factory('mailer', (c) => new MailerService(c.get('mailer_transport')));
```

Now every call to `container.get('mailer')` returns a new instance of the MailerService.

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />
Feel free to check [issues page](https://github.com/rzeczkowskip/dinjectease/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2023 [Piotr Rzeczkowski](https://github.com/rzeczkowskip).<br />
This project is [MIT](LICENSE) licensed.
