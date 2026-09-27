# Cortexcn Portfolio

A free, open-source portfolio template from [Cortexcn](https://www.cortexcn.dev), built with Next.js, Tailwind CSS, and Motion.

## What's inside

- Hero with a big role title and stickers visitors can drag around
- About, services, selected work, testimonials, writing, and contact sections
- A contact form that works with any form endpoint, or falls back to email
- Light and dark mode that follows the visitor's system setting
- Share image, sitemap, and robots file generated from your details

## Make it yours

1. Install and start the dev server:

   ```bash
   pnpm install
   pnpm dev
   ```

2. Edit `config/site.ts`. Every name, link, project, and quote on the page comes from that one file.
3. Replace the covers in `public/projects` and `public/posts` with your own screenshots.
4. Optional: to receive form messages, set `contact.formEndpoint` in `config/site.ts` to a form service URL (for example Formspree or Web3Forms). Left empty, the form opens the visitor's email app.

## Add more components

The template is set up for the shadcn CLI and the Cortexcn registry:

```bash
npx shadcn@latest add @cortexcn/accordion
```

Browse every component at [ui.cortexcn.dev](https://ui.cortexcn.dev/docs/components).

## Deploy

Push the project to GitHub and import it on [Vercel](https://vercel.com/new). No environment variables are needed.

## License

MIT. Use it for yourself or your clients, change anything you like.
