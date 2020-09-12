# Finance Vir

Personal finance tracking and categorization through automatic reading of band statements. No banking information needs to be entered into any online service!

## Setup

1. Create a downloads folder in `back-end` like so: `back-end/downloads`.
2. Put your different statements in individual folders, like the following:
    ```
    back-end
         downloads
             chase-credit-statements
             paypal-statements
    ```
    These folders inside of `downloads` can be named whatever you want.
3. Create a `config.ts` file in the `config` directory by copying and renaming `config.example.ts`. The `config` directory should now look like the following:
    ```
    back-end
         config
             config.ts
             config.example.ts
    ```
4. Modify `downloadsConfig` to include the parsers and directories you need. Each property key is a `ParserType` and their value is an array of paths to directories containing statements of that `ParserType`, relative to `back-end`. See [the example config file for help](back-end/config/config.example.ts).
5. Follow the usage steps below.

## Usage

Run the `start` npm script from the repo's root:

```bash
cd finance-vir
npm start
```

Once you see the `Zwitterion listening on port` message, go to that port on localhost in a browser. By default this is http://localhost:8000

## How it works

The front-end gets all transaction data through web sockets. Thus, there is no need to refresh the page when new statements are downloaded and added to their respective folder.

The pattern JSON is received via a GET request. The front-end then categorizes all the data and presents it. Thus, to get an updated pattern the page must be refreshed.

## Patterns

TODO

See [back-end/patterns/patterns.default.json](back-end/patterns/patterns.default.json). Copy paste this file into a `patterns.json` file in the same directory to make modifications.
