# Formigio Base

> An app to build applications for business

## Local Development

```bash
# Pull down the repo
$ git clone
$ cd your-project-name

# And then install dependencies with yarn.
$ yarn
$ yarn dev

# There are some other separate functions
$ yarn start-renderer-dev
$ yarn start-main-dev
```

## Packaging the Appplication

To package apps for the local platform:

```bash
$ yarn package
```

To package apps for all platforms:

> First, refer to [Multi Platform Build](https://www.electron.build/multi-platform-build) for dependencies.

Then,

```bash
$ yarn package-all
```

To package apps with options:

```bash
$ yarn package -- --[option]
```

To run End-to-End Test

```bash
$ yarn build-e2e
$ yarn test-e2e

# Running e2e tests in a minimized window
$ START_MINIMIZED=true yarn build-e2e

$ yarn test-e2e
```

## Methodology and Development Concepts

> Guiding Principles and How-to

### Creating a Dataflow

1. First, we need to have a smart component in place that has the properties and functions in place to manage data.
1. Next, we have a dumb component that we can use for a styled UI layer. We pass the needed functions and properties - from the application state - from the smart components to the dumb components.
1. Third, we create an action type and action object, to pass to the store via dispatch.
1. Forth, we create a reducer that pushes the data passed in the action object into the application state.

### Persisting State Data to localStorage and the Disk

1. First, we add the data part to the `saveState` function, were we add specific state data to be persisted.
1. Then we add a function in the App component, to load the data from a specific component, and we add that function to the `loadState` callback.

> The dataset you want to persist needs a action object and reducer case that persists the data to the application state once it's fetched. See the `actions/user.js` and `reducers/user.js` for examples.
