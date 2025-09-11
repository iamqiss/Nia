import { MediaSource, MediaLoadResult } from '../types';

export class MediaUtils {
  /**
   * Check if a URI is a valid media URL
   */
  static isValidMediaUrl(uri: string): boolean {
    try {
      const url = new URL(uri);
      return ['http:', 'https:', 'file:', 'content:'].includes(url.protocol);
    } catch {
      return false;
    }
  }

  /**
   * Get media type from URI
   */
  static getMediaTypeFromUri(uri: string): 'video' | 'image' | 'unknown' {
    const extension = uri.split('.').pop()?.toLowerCase();
    
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'm4v', '3gp', 'flv', 'wmv'];
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'tiff', 'ico'];
    
    if (videoExtensions.includes(extension || '')) {
      return 'video';
    } else if (imageExtensions.includes(extension || '')) {
      return 'image';
    }
    
    return 'unknown';
  }

  /**
   * Get file size from URI (if available)
   */
  static async getFileSize(uri: string): Promise<number | null> {
    try {
      const response = await fetch(uri, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      return contentLength ? parseInt(contentLength, 10) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get media dimensions from URI
   */
  static async getMediaDimensions(uri: string): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = uri;
    });
  }

  /**
   * Generate cache key for media URI
   */
  static generateCacheKey(uri: string, options?: any): string {
    const baseKey = uri.replace(/[^a-zA-Z0-9]/g, '_');
    if (options) {
      const optionsKey = JSON.stringify(options).replace(/[^a-zA-Z0-9]/g, '_');
      return `${baseKey}_${optionsKey}`;
    }
    return baseKey;
  }

  /**
   * Format file size in human readable format
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Format duration in human readable format
   */
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }

  /**
   * Calculate aspect ratio
   */
  static calculateAspectRatio(width: number, height: number): number {
    return width / height;
  }

  /**
   * Get optimal dimensions for display
   */
  static getOptimalDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number,
    mode: 'contain' | 'cover' | 'stretch' = 'contain'
  ): { width: number; height: number } {
    const aspectRatio = originalWidth / originalHeight;
    
    switch (mode) {
      case 'contain':
        if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
          return { width: originalWidth, height: originalHeight };
        }
        
        const scaleX = maxWidth / originalWidth;
        const scaleY = maxHeight / originalHeight;
        const scale = Math.min(scaleX, scaleY);
        
        return {
          width: Math.round(originalWidth * scale),
          height: Math.round(originalHeight * scale),
        };
        
      case 'cover':
        const coverScaleX = maxWidth / originalWidth;
        const coverScaleY = maxHeight / originalHeight;
        const coverScale = Math.max(coverScaleX, coverScaleY);
        
        return {
          width: Math.round(originalWidth * coverScale),
          height: Math.round(originalHeight * coverScale),
        };
        
      case 'stretch':
        return { width: maxWidth, height: maxHeight };
        
      default:
        return { width: originalWidth, height: originalHeight };
    }
  }

  /**
   * Check if device supports hardware acceleration
   */
  static isHardwareAccelerationSupported(): boolean {
    // This would need platform-specific implementation
    return true;
  }

  /**
   * Get recommended quality based on network conditions
   */
  static getRecommendedQuality(
    networkType: 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'wifi' | 'unknown',
    deviceMemory?: number
  ): 'low' | 'medium' | 'high' | 'ultra' {
    if (networkType === 'slow-2g' || networkType === '2g') {
      return 'low';
    } else if (networkType === '3g') {
      return 'medium';
    } else if (networkType === '4g' || networkType === '5g' || networkType === 'wifi') {
      if (deviceMemory && deviceMemory < 2) {
        return 'medium';
      }
      return 'high';
    }
    
    return 'medium';
  }

  /**
   * Estimate bandwidth from load time
   */
  static estimateBandwidth(fileSize: number, loadTime: number): number {
    if (loadTime === 0) return 0;
    return (fileSize * 8) / (loadTime / 1000); // bits per second
  }

  /**
   * Check if media is likely to be cached
   */
  static isLikelyCached(uri: string, lastAccessed?: number): boolean {
    // Simple heuristic based on URI patterns
    const cacheablePatterns = [
      /\.(jpg|jpeg|png|gif|webp)$/i,
      /\.(mp4|mov|webm)$/i,
      /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp|mp4|mov|webm)$/i,
    ];
    
    const isCacheable = cacheablePatterns.some(pattern => pattern.test(uri));
    
    if (!isCacheable) return false;
    
    // If recently accessed, likely cached
    if (lastAccessed && Date.now() - lastAccessed < 24 * 60 * 60 * 1000) {
      return true;
    }
    
    return false;
  }

  /**
   * Generate thumbnail URL for video
   */
  static generateVideoThumbnailUrl(videoUrl: string, time: number = 0): string {
    // This would need platform-specific implementation
    // For now, return a placeholder
    return `${videoUrl}#t=${time}`;
  }

  /**
   * Validate media source
   */
  static validateMediaSource(source: MediaSource): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!source.uri) {
      errors.push('URI is required');
    } else if (!this.isValidMediaUrl(source.uri)) {
      errors.push('Invalid URI format');
    }
    
    if (!source.type) {
      errors.push('Type is required');
    } else if (!['video', 'image'].includes(source.type)) {
      errors.push('Type must be either "video" or "image"');
    }
    
    if (source.priority && !['low', 'normal', 'high'].includes(source.priority)) {
      errors.push('Priority must be "low", "normal", or "high"');
    }
    
    if (source.cachePolicy && !['memory', 'disk', 'memory-disk', 'none'].includes(source.cachePolicy)) {
      errors.push('Cache policy must be "memory", "disk", "memory-disk", or "none"');
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create optimized media source
   */
  static createOptimizedMediaSource(
    uri: string,
    type: 'video' | 'image',
    options: {
      priority?: 'low' | 'normal' | 'high';
      cachePolicy?: 'memory' | 'disk' | 'memory-disk' | 'none';
      resize?: { width?: number; height?: number; mode?: 'contain' | 'cover' | 'stretch' | 'center' };
      headers?: Record<string, string>;
    } = {}
  ): MediaSource {
    return {
      uri,
      type,
      priority: options.priority || 'normal',
      cachePolicy: options.cachePolicy || 'memory-disk',
      resize: options.resize,
      headers: options.headers,
    };
  }

  /**
   * Batch create media sources
   */
  static createMediaSources(
    uris: string[],
    type: 'video' | 'image',
    options: {
      priority?: 'low' | 'normal' | 'high';
      cachePolicy?: 'memory' | 'disk' | 'memory-disk' | 'none';
      headers?: Record<string, string>;
    } = {}
  ): MediaSource[] {
    return uris.map(uri => this.createOptimizedMediaSource(uri, type, options));
  }

  /**
   * Filter media sources by type
   */
  static filterMediaSourcesByType(sources: MediaSource[], type: 'video' | 'image'): MediaSource[] {
    return sources.filter(source => source.type === type);
  }

  /**
   * Sort media sources by priority
   */
  static sortMediaSourcesByPriority(sources: MediaSource[]): MediaSource[] {
    const priorityOrder = { high: 3, normal: 2, low: 1 };
    
    return sources.sort((a, b) => {
      const aPriority = priorityOrder[a.priority || 'normal'];
      const bPriority = priorityOrder[b.priority || 'normal'];
      return bPriority - aPriority;
    });
  }

  /**
   * Get media source statistics
   */
  static getMediaSourceStats(sources: MediaSource[]): {
    total: number;
    video: number;
    image: number;
    byPriority: Record<string, number>;
    byCachePolicy: Record<string, number>;
  } {
    const stats = {
      total: sources.length,
      video: 0,
      image: 0,
      byPriority: { low: 0, normal: 0, high: 0 },
      byCachePolicy: { memory: 0, disk: 0, 'memory-disk': 0, none: 0 },
    };
    
    sources.forEach(source => {
      if (source.type === 'video') stats.video++;
      if (source.type === 'image') stats.image++;
      
      const priority = source.priority || 'normal';
      stats.byPriority[priority]++;
      
      const cachePolicy = source.cachePolicy || 'memory-disk';
      stats.byCachePolicy[cachePolicy]++;
    });
    
    return stats;
  }
}