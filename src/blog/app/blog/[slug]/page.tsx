import Image from "next/image";
import { getPostBySlug, getPostList } from "../../dal";
import { notFound } from "next/navigation";

import ReactMarkdown from "react-markdown";
import Link from "next/link";

export async function generateStaticParams() {
  const posts = getPostList();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function Blog({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { title, content, createdAt, author, imageUrl } = post;
  const readingMin = Math.ceil(content.split(" ").length / 200);
  const readingTime = readingMin > 1 ? `${readingMin} mins` : "1 min";

  return (
    <article className="m-auto">
      <div className="text-xs text-slate-800 space-x-2">
        <span>
          Published{" "}
          {new Date(createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
        <span>•</span>
        <span>Reading Time: {readingTime}</span>
      </div>
      <h3 className="text-2xl sm:text-4xl font-medium my-14 text-slate-900">
        {title}
      </h3>
      <div className="flex items-center gap-4">
        <Image
          className="border-solid rounded-full border-0"
          src="/profile.jpg"
          alt="Avatar"
          width={48}
          height={48}
          priority
        />
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-950">{author}</span>

          <div className="flex items-center gap-4 text-slate-800">
            <Link
              href="https://twitter.com/zoogenytv"
              className="flex items-center gap-1">
              <Image
                src="/twitter.svg"
                alt="Twitter icon"
                width={16}
                height={16}
                priority
              />
              <span className="text-xs">Twitter</span>
            </Link>
            <Link
              href="https://github.com/zoogeny"
              className="flex items-center gap-1">
              <Image
                src="/github.svg"
                alt="Github icon"
                width={16}
                height={16}
                priority
              />
              <span className="text-xs">Github</span>
            </Link>
          </div>
        </div>
      </div>
      <hr className="bg-slate-500 my-14 border-1 h-px border-0" />
      <ReactMarkdown className="[&>p]:mb-6 [&>h2]:text-2xl [&>h2]:font-medium [&>h2]:mb-4 mt-8 text-slate-800">
        {content}
      </ReactMarkdown>
    </article>
  );
}
