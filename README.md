# Weather API Server

A simple Express.js server that fetches weather data from the Visual Crossing Weather API and caches the results using Redis. This project implements rate limiting to control API usage and handles requests efficiently.

WEATHER API. More info can be found here: https://roadmap.sh/projects/weather-api-wrapper-service

## Description

In this project, instead of relying on our own weather data, we will build a weather API that fetches and returns weather data from a 3rd party API. This project will help you understand how to work with 3rd party APIs, caching, and environment variables.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Rate Limiting](#rate-limiting)
- [License](#license)

## Installation

To get started, clone this repository and install the necessary dependencies:

```bash
git clone <repository-url>
cd <repository-directory>
npm install
```

Ensure you have Node.js and Redis installed on your machine.

## Usage

Before running the server, you need to set up the environment variables. Create a `.env` file in the root of the project directory with the following content:

```
API_KEY=your_visual_crossing_api_key
REDIS_URL=redis://localhost:6379
PORT=3000
```

To start the server, run:

```bash
npm start
```

The server will be running on the specified port (default: 3000).

### Example .env File

Here’s an example of what your `.env` file might look like:

```
API_KEY=FG6YJ6ZMY3U838JFMGBJKGUPB
REDIS_URL=redis://localhost:6379
PORT=3000
```

## API Endpoints

### `GET /`

Returns a simple message indicating that the server is running.

**Response:**

```json
{
  "message": "Server is running"
}
```

### `GET /weathers`

Fetches weather data from the Visual Crossing API. The response is cached in Redis for 12 hours.

**Response:**

Returns the weather data in JSON format. If the data is cached, it returns the cached data instead of fetching it again.

## Environment Variables

| Variable    | Description                                                   |
| ----------- | ------------------------------------------------------------- |
| `API_KEY`   | Your Visual Crossing API key                                  |
| `REDIS_URL` | URL for your Redis instance (default: redis://localhost:6379) |
| `PORT`      | Port on which the server will run (default: 3000)             |

## Rate Limiting

This application uses `express-rate-limit` to limit the number of requests from each IP address. The default configuration allows 5 requests per 15 minutes.
