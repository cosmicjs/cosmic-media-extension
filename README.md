# Cosmic Media Extension

Search from thousands of royalty-free images and video and to use in your Cosmic Bucket. Includes Unsplash, Pexels, Pixabay, images, video as well as OpenAI image generation from prompt.

## Add to Cosmic dashboard

You can add this to your Cosmic dashboard by logging in and going to Your Project > Bucket > Extensions, finding this extension and clicking "Install".

## Service keys

The deployed extension uses shared keys for Unsplash, Giphy, Pexels, Pixaby, and OpenAI. Since other users using these shared keys may cause API throttling / service issues, you can update these to your own keys by going to Extension > Settings, find the Query Parameters section and update the following query params to your own keys:

1. `unsplash_key` Register for a key [here](https://unsplash.com/developers).
2. `pexels_key` Register for a key [here](https://www.pexels.com/api).
3. `pixabay_key` Register for a key [here](https://pixabay.com/service/about/api)
4. `openai_key` Register for a key [here](https://platform.openai.com)
5. `giphy_key` Register for a key [here](https://developers.giphy.com)

## Run locally

```bash
git clone https://github.com/cosmicjs/cosmic-media-extension
cd cosmic-next-template
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

Licensed under the [MIT license](https://github.com/cosmicjs/cosmic-next-template/blob/main/LICENSE.md).
