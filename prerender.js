import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function fetchAllPosts() {
  try {
    const response = await fetch('https://portfolio.deussearch.fr/wp-json/wp/v2/posts?_embed&per_page=100');
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

async function generateStaticPages() {
  const posts = await fetchAllPosts();
  const template = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8');

  for (const post of posts) {
    const postTitle = post.title.rendered;
    const postDescription = post.excerpt.rendered.replace(/<[^>]*>/g, '');
    const postImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/img/blog.jpg';
    const postUrl = `https://nicolas-gruwe.fr/blog/${post.slug}`;

    const helmet = Helmet.renderStatic();
    const meta = `
      <title>${postTitle} | Blog - Nicolas Gruwe</title>
      <meta name="description" content="${postDescription}" />
      <meta property="og:type" content="article" />
      <meta property="og:title" content="${postTitle} | Blog - Nicolas Gruwe" />
      <meta property="og:description" content="${postDescription}" />
      <meta property="og:image" content="${postImage}" />
      <meta property="og:url" content="${postUrl}" />
      <meta property="og:site_name" content="Nicolas Gruwe - Blog" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${postTitle} | Blog - Nicolas Gruwe" />
      <meta name="twitter:description" content="${postDescription}" />
      <meta name="twitter:image" content="${postImage}" />
      <meta property="article:published_time" content="${post.date}" />
      <meta property="article:modified_time" content="${post.modified}" />
      <meta property="article:author" content="Nicolas Gruwe" />
      <link rel="canonical" href="${postUrl}" />
    `;

    const html = template.replace('</head>', `${meta}</head>`);
    
    const dir = path.resolve(__dirname, `dist/blog/${post.slug}`);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.resolve(dir, 'index.html'), html);
  }
}

generateStaticPages().catch(console.error); 