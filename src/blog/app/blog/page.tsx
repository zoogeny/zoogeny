import Link from "next/link";
import { getPostList } from "../dal";

export default function Blog() {
  const posts = getPostList();
  return (
    <>
      <h3 className="text-xl font-semibold mb-4">Conversations with AI</h3>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <div className="flex items-center gap-2">
              <span className="text-xs pt-0.5 text-slate-900">
                ({new Date(post.createdAt).toLocaleDateString()})
              </span>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
