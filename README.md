# Cosmic Media

Search millions of high-quality, royalty-free stock photos, videos, images, and vectors from one convenient interface. Includes popular online media services: Unsplash, Pexels, Giphy, and Pixabay as well as OpenAI image generation from prompt. [Try it here](https://cosmicmedia.vercel.app/).

<a href="https://cosmicmedia.vercel.app">
  <img width="100%" alt="cosmic-media" src="https://imgix.cosmicjs.com/eee1bf40-3799-11ee-be3f-55e1752361d4-2.png?w=2000&auto=compression" />
</a>
<a href="https://cosmicmedia.vercel.app">
  <img width="100%" alt="cosmic-media" src="https://imgix.cosmicjs.com/b59dd520-3d4d-11ee-82b2-d53af1858037-cosmic-media.png?w=2000&auto=compression"/>
<a/>

## How to use it
You can use Cosmic Media to search and download media manually, or you can install it in your [Cosmic](https://www.cosmicjs.com/) project as an extension to save media directly in your project.


## How to install in Cosmic

1. [Log in to Cosmic](https://app.cosmicjs.com/login).
2. Go to _Project > Extensions_.
3. Find this extension and click "Install".

## Service keys

The deployed app uses default API keys for Unsplash, Giphy, Pexels, Pixaby, and OpenAI. If you run into API rate-limit issues, you can update these to your own keys:

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

<a href="https://app.cosmicjs.com/login">
  <img width="100%" alt="query-params" src="https://imgix.cosmicjs.com/faa928e0-4077-11ee-82b2-d53af1858037-query-params.png?w=2000&auto=compression">
</a>

## Run locally

```bash
git clone https://github.com/cosmicjs/cosmic-media-extension
cd cosmic-media-extension
yarn
yarn dev
```

## Built with
- [shadcn/ui](https://github.com/shadcn-ui/ui)
- Next.js 13 App Directory
- Radix UI Primitives
- Tailwind CSS
- Icons from [Lucide](https://lucide.dev)
- Dark mode with `next-themes`
- Tailwind CSS class sorting, merging and linting.

## License

Licensed under the [MIT license](https://github.com/cosmicjs/cosmic-media-extension/blob/main/LICENSE.md).
