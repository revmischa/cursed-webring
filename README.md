# Cursed Webring

The worst of the internet.

https://cursed.lol


# Architecture
## Frontend 
[src/](tree/master/cdk)

React via Create-React-App with TypeScript and Material-UI.

Fetches a list of shitty sites from the backend and syncs it to a browser-based [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

## Backend
[cdk/](tree/master/cdk)

Built with AWS [CDK](https://docs.aws.amazon.com/cdk/latest/guide/home.html) infrastructure-as-code, TypeScript node.js [lambdas](https://github.com/revmischa/cursed-webring/blob/master/cdk/resources/cursedSites.ts) to fetch the list of sites from a google doc and to handle submission of new sites.

The submission endpoint saves submissions to DynamoDB and sends me a slack message.
