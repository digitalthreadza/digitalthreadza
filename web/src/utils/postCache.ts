import { getAllPosts, getPostBySlug, type Post } from './markdown.js';
import { watch, type FSWatcher } from 'fs';

// Module-level cache state
let postsCache: Post[] = [];
let postsMapCache: Map<string, Post> = new Map();
let watcher: FSWatcher | null = null;
let isInitialized = false;
let postsDirectory = '';

/**
 * Refresh the cache by reading all posts from the filesystem
 */
function refreshCache(): void {
    try {
        postsCache = getAllPosts(postsDirectory);
        postsMapCache = new Map(postsCache.map(post => [post.slug, post]));
        console.log(`✅ Loaded ${postsCache.length} posts into cache`);
    } catch (error) {
        console.error('❌ Error refreshing post cache:', error);
    }
}

/**
 * Handle filesystem changes and refresh cache
 */
function handleFileChange(eventType: string, filename: string | null): void {
    if (filename && filename.endsWith('.md')) {
        console.log(`📝 Detected change: ${filename}, refreshing cache...`);
        refreshCache();
    }
}

/**
 * Start watching the posts directory for changes
 */
function startWatcher(): void {
    // Skip watcher in production if explicitly disabled
    if (process.env.NODE_ENV === 'production' && process.env.DISABLE_FILE_WATCHER === 'true') {
        return;
    }

    try {
        watcher = watch(postsDirectory, { recursive: false }, handleFileChange);
        console.log(`👀 Watching posts directory for changes: ${postsDirectory}`);
    } catch (error) {
        console.error('❌ Error starting file watcher:', error);
    }
}

/**
 * Stop watching the posts directory
 */
function stopWatcher(): void {
    if (watcher) {
        watcher.close();
        watcher = null;
        console.log('🛑 Stopped watching posts directory');
    }
}

/**
 * Initialize the post cache
 * Loads posts into memory and starts watching for changes
 */
export function initializePostCache(postsDir: string): void {
    if (isInitialized) {
        console.warn('⚠️ Post cache already initialized');
        return;
    }

    postsDirectory = postsDir;
    refreshCache();
    startWatcher();
    isInitialized = true;
}

/**
 * Get all posts from cache
 * Returns a copy to prevent external mutations
 */
export function getAllPostsFromCache(): Post[] {
    if (!isInitialized) {
        throw new Error('Post cache not initialized. Call initializePostCache() first.');
    }
    return [...postsCache];
}

/**
 * Get a post by slug from cache
 */
export function getPostBySlugFromCache(slug: string): Post | null {
    if (!isInitialized) {
        throw new Error('Post cache not initialized. Call initializePostCache() first.');
    }
    return postsMapCache.get(slug) || null;
}

/**
 * Manually refresh the cache (useful for programmatic updates)
 */
export function refreshPostCache(): void {
    if (!isInitialized) {
        throw new Error('Post cache not initialized. Call initializePostCache() first.');
    }
    refreshCache();
}

/**
 * Cleanup: stop watcher and clear cache
 * Useful for graceful shutdowns
 */
export function destroyPostCache(): void {
    stopWatcher();
    postsCache = [];
    postsMapCache.clear();
    isInitialized = false;
    console.log('🧹 Post cache destroyed');
}

