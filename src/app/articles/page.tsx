import Link from "next/link";
import { getArticles } from "@/lib/articles";
import { siteConfig } from "../../../site.config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `コラム一覧 | ${siteConfig.name}`,
  description: "不動産売却に関するお役立ち情報をお届けします。",
};

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">コラム一覧</h1>

      {articles.length === 0 ? (
        <p className="text-center text-gray-500">記事はまだありません。</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="block bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-5">
                <time className="text-xs text-gray-400">{article.date}</time>
                <h2 className="mt-2 font-bold text-gray-800 line-clamp-2">{article.title}</h2>
                <p className="mt-2 text-sm text-gray-500 line-clamp-3">{article.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
