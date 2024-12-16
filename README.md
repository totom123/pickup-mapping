# Route Wizard

This is an app designed for drivers that allows users to select two locations and displays the shortest driving route, helping them plan their journeys efficiently and save time and fuel.

## Getting started with local development

### Environment variables

Create a `.env` file with environment variables. You can use the `.env.example` file as a reference.

Here's the list of all the environment variables:

| Env variable          | Description        |
| --------------------- | ------------------ |
| `VITE_GOOGLE_MAP_KEY` | Google map API key |

If you don't provide some of the variables, the corresponding features will be disabled in the UI.

### Running the app locally

Install the dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Lint

ESLint:

```
npm run lint
```

Prettier:

## Tests

```
npm run test:run
```

### Build

```
npm run build
```

## Frameworks

This app is built using the following frameworks:

- React
- MUI
