/**
 * Reach out to the reddit API, and get the first page of results from
 * r/aww. Filter out posts without readily available images or videos,
 * and return a random result.
 * @returns The url of an image or video which is cute.
 */
export async function getCuteUrl() {
  console.log('Fetching from Reddit');
  const response = await fetch(redditUrl, {
    headers: {
      'User-Agent': 'justinbeckwith:awwbot:v1.0.0 (by /u/justinblat)',
    },
  });
  console.log('Checking Reddit response');
  if (!response.ok) {
    console.log('Response not ok');
    let errorText = `Error fetching ${response.url}: ${response.status} ${response.statusText}`;
    try {
      const error = await response.text();
      if (error) {
        errorText = `${errorText} \n\n ${error}`;
      }
    } catch {
      // ignore
    }
    console.log(errorText);
    throw new Error(errorText);
  }
  console.log('Response ok');
  const data = await response.json();
  const posts = data.data.children
    .map((post) => {
      if (post.is_gallery) {
        return '';
      }
      return (
        post.data?.media?.reddit_video?.fallback_url ||
        post.data?.secure_media?.reddit_video?.fallback_url ||
        post.data?.url
      );
    })
    .filter((post) => !!post);
  const randomIndex = Math.floor(Math.random() * posts.length);
  const randomPost = posts[randomIndex];
  console.log('Returning post');
  return randomPost;
}

export const redditUrl = 'https://www.reddit.com/r/aww/hot.json';
