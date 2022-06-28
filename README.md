# Third-Party Bots Custom Endpoint Reference Service

This repository showcases the Third Party Bots Custom Endpoint API. It also represents the single point
of truth for the API specification.

> Note: code in this repository is for demonstration purpose `ONLY` please do not use this code in production
> scenario. We have used local caching for storing/retrieving information which can effect the server
> memory usage.

## Service Specification Concepts

> Note: Detailed concepts of Service Implementation can be found in the official documentation of
> Custom Endpoint [here][cbserimpl]

This section define some basic concepts of Custom Endpoint Reference Service specification. The specification
describes a REST API that can support different versions of multiple bots. The URL for a bot instance looks like
the following example:

> `{BaseUrl}`/v1/bots/`{BotId}`/environments/`{EnvironmentId}`

### Api Versions

Api versions as part of the URL are following the schema "v{x}" without any leading zeros. For the time being
only `v1` has been defined and needs to be supported. We enforce that it should be included in all endpoints.

### Authentication

Third-Party Bots will authenticate its requests to the Custom Endpoint API by sending a signed JWT generated
using private [conversational cloud applications][ccapp].

### Bots

A bot is identified by its UUID or a similar alphanumeric identifier.A service implementation can restrict
access to bots bases on the `accountId` provided as the 'aud' field on the authentication WebToken

### Environments

Every bot can have multiple versions with different conversational flows and intents. To address this the API
**should provide** at least one standard environment named `draft` for each bot. Further environments can
be provided as needed. A bot environment will report the currently deployed bot version and its state. A bot
environment should report it's state as `online` or otherwise the bot connection test will fail in Third-Party
Bots. A bot environment should report a Semantic Version that describes what version of the bot
(conversational flow, intents, etc) is deployed on this environment

### Conversations

Conversation will be created for a specific bot on an environment and are addressed by the LP conversation id.
Additional context like SDES and conversation details are provided on the creation of the conversation.

### Events

An Event describes content send by a participant on a conversation (only the customer at this point)
or events generated by the conversation itself (started/ended/(transferred))

### Bot Responses

A Bot response itself does not have its own resource. It is expected to be sent by the API on the response
body at the creation of a new event resource. At the moment getting historic data on the conversation or
any details on the conversation are not considered part of the specification and might only be optionally
implemented by services.

### Service Structure

- 📂 **third\-party\-bots\-custom\-endpoint\-reference\-service\-public**
  - 📄 [Dockerfile](Dockerfile) `Docker definition`
  - 📄 [nodemon.json](nodemon.json) `Nodemon configuration`
  - 📄 [package.json](package.json) `Packages definitions`
  - 📂 **src**
    - 📂 **configs**
      - 📄 [app.ts](src/configs/app.ts) `...Contains the Application configs`
    - 📂 **controllers** `...Contains Routes definitions`
      - 📂 **requestBodies** `...Contains Request bodies definition`
      - 📂 **responseBodies** `...Contains Response bodies definition`
    - 📂 **docs**
      - 📄 [v1.json](src/docs/v1.json) `Swagger OpenAPI 3.0 Schema definition`
    - 📄 [index.ts](src/index.ts) `Service entry point file`
    - 📂 **middlewares**
      - 📄 [SecurityMiddleware.ts](src/middlewares/SecurityMiddleware.ts) `Security Middleware for Auth`
    - 📂 **models** `...Contains service interface definitions and Bots models`
    - 📂 **services**
      - 📄 [BotService.ts](src/services/BotService.ts) `Implements Bot related CRUD methods using Cache`
      - 📄 [LivePersonService.ts](src/services/LivePersonService.ts) `LivePerson APIs call`
    - 📂 **utils**
      - 📄 [Cache.ts](src/utils/Cache.ts) `Implements a simple Cache Singleton Class`
      - 📄 [Response.ts](src/utils/Response.ts) `Implements a mapping of responses for Events`
  - 📄 [tsconfig.json](tsconfig.json) `TypeScript configuration file`
  - 📄 [yarn.lock](yarn.lock) `lock files of dependencies`

## Installation

This service requires [Node.js](https://nodejs.org/) v16+ to run, [TypeScript](https://www.typescriptlang.org/) v4.7.3+ to compile and run and [nodemon](https://nodemon.io/) v 2.0.16+
to run locally in development mode.

Install the dependencies and devDependencies and start the server in development mode.

```sh
yarn install
yarn dev
```

For production environments

```sh
yarn install
yarn start
```

For building the package

```sh
yarn build
```

For cleaning the old build

```sh
yarn clean
```

## Docker

Service is very easy to install and deploy in a Docker container.

By default, the Docker will expose port `4004`, so change this within the
Dockerfile if necessary. When ready, simply use the Dockerfile to
build the image.

```sh
docker build -t tpb_custom_endpoint_service .
```

Once done, run the Docker image and map the port to whatever you wish on
your host. In this example, we simply map port `4004` of the host to
port 4004 of the Docker (or whatever port was exposed in the Dockerfile):

```sh
docker run -d -p 4004:4004 tpb_custom_endpoint_service
```

## Features

- Contains implementation of `v1` of the Custom Endpoint API specification
- Contains supported Bot response examples.
- Contains the OpenAPI specification (found under `/src/docs/`)
- Contains local caching for the calls to the LivePerson APIs

### Bots

in this service implementation we have configured some bots model manually that can be used in Vendor
config setup (please make sure to use bot with `online` state). Implementation of such model generation
can be found [here](src/models/bots/index.ts). List of available bots is as follows:

- `5809777a-e548-4bd2-bc5f-a1003c132a28` - Bot with online state
- `36d5de7f-6c83-41ba-836d-28ca1062c1ef` - Bot with offline state
- `42773157-adcf-4ec1-a2ae-9b935d80cb81` - Bot with error state
- `213aa6c6-f6d9-11ec-b939-0242ac120002` - Bot with draft state
- `bfb807d6-f6d8-11ec-b939-0242ac120002` - Bot with maintenance state

### Supported Customer Utterances

In this service implementation we have configured some Bot Responses that are supported by Third-Party Bots.
These response are defined in [src/utils/Response.ts](src/utils/Response.ts) On sending customer utterances (as shown in below table)
this service will send response:

#### Transfer Action

> Note: You will need to change response configuration as per your use case in method `getTransferAction`
> present in the [src/utils/Response.ts](src/utils/Response.ts). You will need to add your own `skillName` to which transfer action
> should happen.

Following utterances will generate Transfer Action

- `escalate`
- `transfer`
- `i want to talk to human`
- `i want to speak to a human`

#### Close Action

Following utterances will generate Close Action

- `bye`
- `close`
- `close conversation`
- `goodbye`

#### Change Time to Response (TTR) Action

Following utterances will generate Change TTR Action

- `urgent help`
- `urgent`
- `need help now`
- `need help`

#### Invoke FaaS Function

> Note: You will need to change response configuration as per your use case in method `getInvokeFunctionAction`
> present in the [src/utils/Response.ts](src/utils/Response.ts). You will need to add your own `lambdaUuid` and `payload` for the function you
> want to invoke with this method

Following utterances will generate FaaS Action

- `faas`
- `invoke function`
- `invoke`
- `function call`

#### Structured Content

Following utterances will generate Structured Content response

- `structured content`
- `rich content`

#### Delay

Following utterances will generate delay response

- `delay`
- `send delay`
- `delay response`

#### Quick Replies

> Note: This response is only supported in Messaging Conversation

- `quick replies`
- `quick replies example`

#### Private Text

- `private text`
- `private text example`

#### Rich Content Event

> Note: This response is only supported in Messaging Conversation. More information on this can be found [here][richcontentevent]

Any Rich Content passed via customer will be rendered with all the raw data

#### Survey Start Event

> Note: This response is only supported in Survey Bots Conversation

Event with type `START` will cause changes to respond with Survey Start event

#### Survey Close Event

> Note: This response is only supported in Survey Bots Conversation

Event with type `CLOSE_CONVERSATION` will cause changes to respond with Survey Close event

## License

MIT

[cbintro]: https://developers.liveperson.com/third-party-bots-custom-endpoint-introduction.html
[cbserimpl]: https://developers.liveperson.com/third-party-bots-custom-endpoint-service-implementation.html
[ccapp]: https://developers.liveperson.com/conversational-cloud-applications-what-is-a-conversational-cloud-application.html
[richcontentevent]: https://developers.liveperson.com/third-party-bots-custom-endpoint-advanced-features.html#receiving-rich-content-response-messaging-only
