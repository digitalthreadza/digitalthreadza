import { Layout } from '../components/Layout.js';
import { getAllPostsFromCache } from '../utils/postCache.js';

export function indexRoute() {
    const posts = getAllPostsFromCache();
    
    return (
        <Layout title="Home - Markdown Blog">
            <h2>All Posts</h2>
            {posts.length === 0 ? (
                <p>No posts found. Add some markdown files to the /posts directory.</p>
            ) : (
                <ul class="post-list">
                    {posts.map(post => (
                        <li>
                            <a href={`/posts/${post.slug}`}>{post.metadata.title}</a>
                            {post.metadata.date && (
                                <div class="post-meta">
                                    Published: {new Date(post.metadata.date).toLocaleDateString()}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </Layout>
    );
}

