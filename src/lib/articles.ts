import fs from "fs";
import path from "path";
import matter from "gray-matter";

const articlesDirectory = path.join(process.cwd(), "content/articles");

export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  keywords: string[];
  content: string;
}

export function getArticles(): Article[] {
  if (!fs.existsSync(articlesDirectory)) return [];

  const files = fs.readdirSync(articlesDirectory).filter((f) => f.endsWith(".md"));

  const articles = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const filePath = path.join(articlesDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      date: data.date || "",
      keywords: data.keywords || [],
      content,
    };
  });

  return articles.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getRelatedArticles(currentSlug: string, limit = 3): Article[] {
  const all = getArticles();
  const current = all.find((a) => a.slug === currentSlug);
  if (!current) return all.slice(0, limit);

  const others = all.filter((a) => a.slug !== currentSlug);
  const scored = others.map((a) => ({
    article: a,
    score: a.keywords.filter((k) => current.keywords.includes(k)).length,
  }));

  scored.sort((x, y) => {
    if (y.score !== x.score) return y.score - x.score;
    return x.article.date > y.article.date ? -1 : 1;
  });

  return scored.slice(0, limit).map((s) => s.article);
}

export function getArticle(slug: string): Article | null {
  const filePath = path.join(articlesDirectory, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    date: data.date || "",
    keywords: data.keywords || [],
    content,
  };
}
