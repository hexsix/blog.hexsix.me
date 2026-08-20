import type { APIRoute, GetStaticPathsResult } from "astro";
import { getCollection } from "astro:content";
import getUniqueTags from "@/utils/getUniqueTags";
import getPostsByTag from "@/utils/getPostsByTag";
import { generateOgImageForTag } from "@/utils/generateOgImages";
import { SITE } from "@/config";

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  if (!SITE.dynamicOgImage) {
    return [];
  }

  // 与 tags/[tag]/[...page].astro 保持一致：只取 blog 集合，
  // 数量口径也走同一条 getPostsByTag（内部已过滤草稿与未到发布时间的）
  const posts = await getCollection("blog");

  return getUniqueTags(posts).map(({ tag, tagName }) => ({
    params: { tag },
    props: { tagName, postCount: getPostsByTag(posts, tag).length },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  if (!SITE.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }

  const buffer = await generateOgImageForTag(
    props.tagName as string,
    props.postCount as number
  );
  return new Response(new Uint8Array(buffer), {
    headers: { "Content-Type": "image/png" },
  });
};
