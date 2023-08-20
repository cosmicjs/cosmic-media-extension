# Cosmic Media

Search from millions of high-quality, royalty-free stock photos, videos, images, and vectors. Includes some of the most popular stock image services: Unsplash, Pexels, Giphy, and Pixabay as well as OpenAI image generation from prompt. [Try it here](https://cosmicmedia.vercel.app/).

<img width="100%" alt="cosmic-media" src="https://github.com/cosmicjs/cosmic-media-extension/assets/1950722/ab1992c9-bbc0-4ef1-8977-87b07a74b742">

## How to use it
You can use Cosmic Media to search and download media manually, or you can install it in your [Cosmic](https://www.cosmicjs.com/) project as an extension to save media directly in your project.


## How to install in Cosmic

1. [Log in to Cosmic](https://app.cosmicjs.com/login).
2. Go to _Project > Extensions_.
3. Find this extension and click "Install".

## Service keys

The extension uses default API keys for Unsplash, Giphy, Pexels, Pixaby, and OpenAI. Since other users using these shared keys may cause API throttling / service issues, you can update these to your own keys:

1. `unsplash_key` Register for a key [here](https://unsplash.com/developers).
2. `pexels_key` Register for a key [here](https://www.pexels.com/api).
3. `pixabay_key` Register for a key [here](https://pixabay.com/service/about/api)
4. `openai_key` Register for a key [here](https://platform.openai.com)
5. `giphy_key` Register for a key [here](https://developers.giphy.com)

### Using service keys
Keys can be provided to the app in one of the following ways:

1. As query params in the URL. For example: `?unsplash_key=YOUR_UNSPLASH_KEY&pexels_key=YOUR_PEXELS_KEY`
2. Using the `.env` file. See the `.env.example` file for env var format.
3. If installed in Cosmic as an extension, go to Cosmic Media extension settings page by going to _Extensions > Cosmic Media > Settings_, find the Query Parameters section and update the following query params to your own keys:

<img width="1122" alt="query-params" src="https://github.com/cosmicjs/cosmic-media-extension/assets/1950722/61f79248-cd72-4f9f-a7f3-eb4e24d28dd7">


## Run locally

```bash
git clone https://github.com/cosmicjs/cosmic-media-extension
cd cosmic-media-template
yarn
yarn dev
```

## Features

- Next.js 13 App Directory
- Radix UI Primitives
- Tailwind CSS
- Icons from [Lucide](https://lucide.dev)
- Dark mode with `next-themes`
- Tailwind CSS class sorting, merging and linting.

## License

Licensed under the [MIT license](https://github.com/cosmicjs/media-extension/blob/main/LICENSE.md).
