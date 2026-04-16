import { getArticle, getArticles, getRelatedArticles } from "@/lib/articles";
import { ArticleMidCTA } from "@/components/ArticleMidCTA";
import { siteConfig } from "../../../../site.config";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const articles = getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "記事が見つかりません" };
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      publishedTime: article.date,
    },
    twitter: {
      card: "summary",
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: `${siteConfig.url}/articles/${slug}`,
    },
  };
}

function ArticleJsonLd({ title, description, date, slug }: { title: string; description: string; date: string; slug: string }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: date,
    author: {
      "@type": "Organization",
      name: siteConfig.footer.companyName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.footer.companyName,
    },
    mainEntityOfPage: `${siteConfig.url}/articles/${slug}`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const processedContent = await remark().use(gfm).use(html).process(article.content);
  const contentHtml = processedContent.toString();
  const related = getRelatedArticles(slug, 3);

  // 本文を h2 で分割して中盤にCTAを挿入
  const h2Splits = contentHtml.split(/(<h2[^>]*>)/);
  const midIndex = Math.floor(h2Splits.length / 2);
  // 偶数インデックスが通常テキスト、奇数インデックスが h2 開始タグ
  const roundedMidIndex = midIndex % 2 === 0 ? midIndex + 1 : midIndex;
  const firstHalfHtml = h2Splits.slice(0, roundedMidIndex).join("");
  const secondHalfHtml = h2Splits.slice(roundedMidIndex).join("");

  return (
    <>
      <ArticleJsonLd
        title={article.title}
        description={article.description}
        date={article.date}
        slug={slug}
      />
      <article className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/articles" className="text-[#c8102e] hover:underline text-sm">
            ← コラム一覧に戻る
          </Link>
        </div>

        <time className="text-sm text-gray-400">{article.date}</time>
        <h1 className="text-3xl font-bold mt-2 mb-8">{article.title}</h1>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: firstHalfHtml }}
        />

        <ArticleMidCTA />

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: secondHalfHtml }}
        />

        {/* 関連記事 */}
        {related.length > 0 && (
          <section className="mt-16">
            <p className="text-[#c8102e] text-xs font-bold tracking-[0.3em] mb-2 text-center">── 関連記事 ──</p>
            <h2 className="font-[family-name:var(--font-noto-serif-jp)] text-xl md:text-2xl font-black text-[#0a1f3d] text-center mb-8">
              あわせて読みたい
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/articles/${rel.slug}`}
                  className="block bg-[#f5f2eb] hover:shadow-md transition-shadow border-t-4 border-[#0a1f3d] p-5"
                >
                  <time className="text-xs text-gray-400 font-bold">{rel.date}</time>
                  <h3 className="mt-2 font-bold text-[#0a1f3d] line-clamp-2 text-base leading-snug">
                    {rel.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {rel.description}
                  </p>
                  <span className="mt-3 inline-block text-[#c8102e] text-sm font-bold">
                    続きを読む ▶
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-12 bg-[#F1F1EF] rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-[#c8102e]">あなたの事業に使える補助金、無料で診断します</h2>
          <p className="mt-2 text-gray-600">採択率90%超の実績。まずはLINEで無料診断。</p>
          <Link
            href="/contact"
            className="mt-4 inline-block bg-[#c8102e] hover:bg-[#a50d24] text-white font-bold px-8 py-3 rounded-full transition-colors"
          >
            無料補助金診断はこちら
          </Link>
        </div>
      </article>
    </>
  );
}
