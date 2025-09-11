//
// Copyright (c) 2025 Neo Qiss
// All rights reserved.
//
// This software is proprietary and confidential.
// Unauthorized copying, distribution, or use is strictly prohibited.
//

import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type AppBskyFeedDefs } from '@atproto/api' // Legacy - will be removed;

import { useToggleMutationQueue } from '#/lib/hooks/useToggleMutationQueue';
import { type LogEvents, toClout } from '#/lib/statsig/statsig';
import { logger } from '#/logger';
import { updatePostShadow } from '#/state/cache/post-shadow';
import { type Shadow } from '#/state/cache/types';
import { useAgent, useSession } from '#/state/session';
import * as userActionHistory from '#/state/userActionHistory';
import { useIsThreadMuted, useSetThreadMute } from '../cache/thread-mutes';
import { findProfileQueryData } from './profile';
import MigrationAdapter from '#/lib/grpc/migration/MigrationAdapter';
import { 
  CreateNoteRequest, 
  GetNoteRequest, 
  LikeNoteRequest, 
  RenoteNoteRequest, 
  DeleteNoteRequest,
  NoteVisibility,
  ContentWarning,
} from '#/lib/grpc/TimeGrpcService';

const RQKEY_ROOT = 'post';
export const RQKEY = (postUri: string) => [RQKEY_ROOT, postUri];

/**
 * Hook to get a post using gRPC or REST based on feature flags
 */
export function usePostQuery(uri: string | undefined) {
  const agent = useAgent();
  const migrationAdapter = MigrationAdapter.getInstance();
  
  return useQuery<AppBskyFeedDefs.PostView>({
    queryKey: RQKEY(uri || ''),
    async queryFn() {
      if (!uri) throw new Error('No URI provided');
      
      // Extract note ID from URI
      const noteId = uri.split('/').pop() || '';
      const requestingUserId = agent.session?.did || '';
      
      const request: GetNoteRequest = {
        noteId,
        requestingUserId,
        includeThread: true,
      };
      
      const response = await migrationAdapter.getNote(request, agent);
      
      if (response.success) {
        // Convert gRPC response to REST format for compatibility
        return convertGrpcNoteToRestPost(response.note);
      } else {
        throw new Error(response.errorMessage || 'Failed to get note');
      }
    },
    enabled: !!uri,
  });
}

/**
 * Hook to get a post (for programmatic access)
 */
export function useGetPost() {
  const queryClient = useQueryClient();
  const agent = useAgent();
  const migrationAdapter = MigrationAdapter.getInstance();
  
  return useCallback(
    async ({ uri }: { uri: string }) => {
      return queryClient.fetchQuery({
        queryKey: RQKEY(uri || ''),
        async queryFn() {
          const noteId = uri.split('/').pop() || '';
          const requestingUserId = agent.session?.did || '';
          
          const request: GetNoteRequest = {
            noteId,
            requestingUserId,
            includeThread: true,
          };
          
          const response = await migrationAdapter.getNote(request, agent);
          
          if (response.success) {
            return convertGrpcNoteToRestPost(response.note);
          } else {
            throw new Error(response.errorMessage || 'Failed to get note');
          }
        },
      });
    },
    [queryClient, agent],
  );
}

/**
 * Hook to get multiple posts
 */
export function useGetPosts() {
  const queryClient = useQueryClient();
  const agent = useAgent();
  const migrationAdapter = MigrationAdapter.getInstance();
  
  return useCallback(
    async ({ uris }: { uris: string[] }) => {
      return queryClient.fetchQuery({
        queryKey: RQKEY(uris.join(',') || ''),
        async queryFn() {
          const requests = uris.map(uri => {
            const noteId = uri.split('/').pop() || '';
            const requestingUserId = agent.session?.did || '';
            
            return {
              noteId,
              requestingUserId,
              includeThread: false,
            };
          });
          
          const responses = await Promise.all(
            requests.map(request => migrationAdapter.getNote(request, agent))
          );
          
          return responses
            .filter(response => response.success)
            .map(response => convertGrpcNoteToRestPost(response.note));
        },
      });
    },
    [queryClient, agent],
  );
}

/**
 * Hook for post like mutation queue with gRPC/REST migration
 */
export function usePostLikeMutationQueue(
  post: Shadow<AppBskyFeedDefs.PostView>,
  viaRepost: { uri: string; cid: string } | undefined,
  feedDescriptor: string | undefined,
  logContext: LogEvents['post:like']['logContext'] &
    LogEvents['post:unlike']['logContext'],
) {
  const queryClient = useQueryClient();
  const postUri = post.uri;
  const postCid = post.cid;
  const initialLikeUri = post.viewer?.like;
  const likeMutation = usePostLikeMutation(feedDescriptor, logContext, post);
  const unlikeMutation = usePostUnlikeMutation(feedDescriptor, logContext);

  const queueToggle = useToggleMutationQueue({
    initialState: initialLikeUri,
    runMutation: async (prevLikeUri, shouldLike) => {
      if (shouldLike) {
        const { uri: likeUri } = await likeMutation.mutateAsync({
          uri: postUri,
          cid: postCid,
          via: viaRepost,
        });
        userActionHistory.like([postUri]);
        return likeUri;
      } else {
        if (prevLikeUri) {
          await unlikeMutation.mutateAsync({
            postUri: postUri,
            likeUri: prevLikeUri,
          });
          userActionHistory.unlike([postUri]);
        }
        return undefined;
      }
    },
    onSuccess(finalLikeUri) {
      // finalize
      updatePostShadow(queryClient, postUri, {
        likeUri: finalLikeUri,
      });
    },
  });

  const queueLike = useCallback(() => {
    // optimistically update
    updatePostShadow(queryClient, postUri, {
      likeUri: 'pending',
    });
    return queueToggle(true);
  }, [queryClient, postUri, queueToggle]);

  const queueUnlike = useCallback(() => {
    // optimistically update
    updatePostShadow(queryClient, postUri, {
      likeUri: undefined,
    });
    return queueToggle(false);
  }, [queryClient, postUri, queueToggle]);

  return [queueLike, queueUnlike];
}

/**
 * Hook for post like mutation with gRPC/REST migration
 */
function usePostLikeMutation(
  feedDescriptor: string | undefined,
  logContext: LogEvents['post:like']['logContext'],
  post: Shadow<AppBskyFeedDefs.PostView>,
) {
  const { currentAccount } = useSession();
  const queryClient = useQueryClient();
  const postAuthor = post.author;
  const agent = useAgent();
  const migrationAdapter = MigrationAdapter.getInstance();
  
  return useMutation<
    { uri: string }, // responds with the uri of the like
    Error,
    { uri: string; cid: string; via?: { uri: string; cid: string } } // the post's uri and cid, and the repost uri/cid if present
  >({
    mutationFn: async ({ uri, cid, via }) => {
      let ownProfile: any;
      if (currentAccount) {
        ownProfile = findProfileQueryData(queryClient, currentAccount.did);
      }
      
      logger.metric('post:like', {
        logContext,
        doesPosterFollowLiker: postAuthor.viewer
          ? Boolean(postAuthor.viewer.followedBy)
          : undefined,
        doesLikerFollowPoster: postAuthor.viewer
          ? Boolean(postAuthor.viewer.following)
          : undefined,
        likerClout: toClout(ownProfile?.followersCount),
        postClout:
          post.likeCount != null &&
          post.repostCount != null &&
          post.replyCount != null
            ? toClout(post.likeCount + post.repostCount + post.replyCount)
            : undefined,
        feedDescriptor: feedDescriptor,
      });
      
      // Extract note ID and user ID
      const noteId = uri.split('/').pop() || '';
      const userId = agent.session?.did || '';
      
      const request: LikeNoteRequest = {
        noteId,
        userId,
        like: true,
      };
      
      const response = await migrationAdapter.likeNote(request, agent);
      
      if (response.success) {
        return { uri: `like-${noteId}-${userId}` }; // Generate like URI
      } else {
        throw new Error(response.errorMessage || 'Failed to like note');
      }
    },
  });
}

/**
 * Hook for post unlike mutation with gRPC/REST migration
 */
function usePostUnlikeMutation(
  feedDescriptor: string | undefined,
  logContext: LogEvents['post:unlike']['logContext'],
) {
  const agent = useAgent();
  const migrationAdapter = MigrationAdapter.getInstance();
  
  return useMutation<void, Error, { postUri: string; likeUri: string }>({
    mutationFn: async ({ postUri, likeUri }) => {
      logger.metric('post:unlike', { logContext, feedDescriptor });
      
      // Extract note ID and user ID
      const noteId = postUri.split('/').pop() || '';
      const userId = agent.session?.did || '';
      
      const request: LikeNoteRequest = {
        noteId,
        userId,
        like: false,
      };
      
      const response = await migrationAdapter.likeNote(request, agent);
      
      if (!response.success) {
        throw new Error(response.errorMessage || 'Failed to unlike note');
      }
    },
  });
}

/**
 * Hook for post repost mutation queue with gRPC/REST migration
 */
export function usePostRepostMutationQueue(
  post: Shadow<AppBskyFeedDefs.PostView>,
  viaRepost: { uri: string; cid: string } | undefined,
  feedDescriptor: string | undefined,
  logContext: LogEvents['post:repost']['logContext'] &
    LogEvents['post:unrepost']['logContext'],
) {
  const queryClient = useQueryClient();
  const postUri = post.uri;
  const postCid = post.cid;
  const initialRepostUri = post.viewer?.repost;
  const repostMutation = usePostRepostMutation(feedDescriptor, logContext);
  const unrepostMutation = usePostUnrepostMutation(feedDescriptor, logContext);

  const queueToggle = useToggleMutationQueue({
    initialState: initialRepostUri,
    runMutation: async (prevRepostUri, shouldRepost) => {
      if (shouldRepost) {
        const { uri: repostUri } = await repostMutation.mutateAsync({
          uri: postUri,
          cid: postCid,
          via: viaRepost,
        });
        return repostUri;
      } else {
        if (prevRepostUri) {
          await unrepostMutation.mutateAsync({
            postUri: postUri,
            repostUri: prevRepostUri,
          });
        }
        return undefined;
      }
    },
    onSuccess(finalRepostUri) {
      // finalize
      updatePostShadow(queryClient, postUri, {
        repostUri: finalRepostUri,
      });
    },
  });

  const queueRepost = useCallback(() => {
    // optimistically update
    updatePostShadow(queryClient, postUri, {
      repostUri: 'pending',
    });
    return queueToggle(true);
  }, [queryClient, postUri, queueToggle]);

  const queueUnrepost = useCallback(() => {
    // optimistically update
    updatePostShadow(queryClient, postUri, {
      repostUri: undefined,
    });
    return queueToggle(false);
  }, [queryClient, postUri, queueToggle]);

  return [queueRepost, queueUnrepost];
}

/**
 * Hook for post repost mutation with gRPC/REST migration
 */
function usePostRepostMutation(
  feedDescriptor: string | undefined,
  logContext: LogEvents['post:repost']['logContext'],
) {
  const agent = useAgent();
  const migrationAdapter = MigrationAdapter.getInstance();
  
  return useMutation<
    { uri: string }, // responds with the uri of the repost
    Error,
    { uri: string; cid: string; via?: { uri: string; cid: string } } // the post's uri and cid, and the repost uri/cid if present
  >({
    mutationFn: async ({ uri, cid, via }) => {
      logger.metric('post:repost', { logContext, feedDescriptor });
      
      // Extract note ID and user ID
      const noteId = uri.split('/').pop() || '';
      const userId = agent.session?.did || '';
      
      const request: RenoteNoteRequest = {
        noteId,
        userId,
        isQuoteRenote: false,
        quoteText: undefined,
      };
      
      const response = await migrationAdapter.renoteNote(request, agent);
      
      if (response.success) {
        return { uri: response.renoteNote.id };
      } else {
        throw new Error(response.errorMessage || 'Failed to repost note');
      }
    },
  });
}

/**
 * Hook for post unrepost mutation with gRPC/REST migration
 */
function usePostUnrepostMutation(
  feedDescriptor: string | undefined,
  logContext: LogEvents['post:unrepost']['logContext'],
) {
  const agent = useAgent();
  const migrationAdapter = MigrationAdapter.getInstance();
  
  return useMutation<void, Error, { postUri: string; repostUri: string }>({
    mutationFn: async ({ postUri, repostUri }) => {
      logger.metric('post:unrepost', { logContext, feedDescriptor });
      
      // Extract note ID and user ID
      const noteId = postUri.split('/').pop() || '';
      const userId = agent.session?.did || '';
      
      const request: RenoteNoteRequest = {
        noteId,
        userId,
        isQuoteRenote: false,
        quoteText: undefined,
      };
      
      const response = await migrationAdapter.renoteNote(request, agent);
      
      if (!response.success) {
        throw new Error(response.errorMessage || 'Failed to unrepost note');
      }
    },
  });
}

/**
 * Hook for post delete mutation with gRPC/REST migration
 */
export function usePostDeleteMutation() {
  const queryClient = useQueryClient();
  const agent = useAgent();
  const migrationAdapter = MigrationAdapter.getInstance();
  
  return useMutation<void, Error, { uri: string }>({
    mutationFn: async ({ uri }) => {
      // Extract note ID and user ID
      const noteId = uri.split('/').pop() || '';
      const userId = agent.session?.did || '';
      
      const request: DeleteNoteRequest = {
        noteId,
        userId,
      };
      
      const response = await migrationAdapter.deleteNote(request, agent);
      
      if (!response.success) {
        throw new Error(response.errorMessage || 'Failed to delete note');
      }
    },
    onSuccess(_, variables) {
      updatePostShadow(queryClient, variables.uri, { isDeleted: true });
    },
  });
}

/**
 * Hook for thread mute mutation queue
 */
export function useThreadMuteMutationQueue(
  post: Shadow<AppBskyFeedDefs.PostView>,
  rootUri: string,
) {
  const threadMuteMutation = useThreadMuteMutation();
  const threadUnmuteMutation = useThreadUnmuteMutation();
  const isThreadMuted = useIsThreadMuted(rootUri, post.viewer?.threadMuted);
  const setThreadMute = useSetThreadMute();

  const queueToggle = useToggleMutationQueue<boolean>({
    initialState: isThreadMuted,
    runMutation: async (_prev, shouldMute) => {
      if (shouldMute) {
        await threadMuteMutation.mutateAsync({
          uri: rootUri,
        });
        return true;
      } else {
        await threadUnmuteMutation.mutateAsync({
          uri: rootUri,
        });
        return false;
      }
    },
    onSuccess(finalIsMuted) {
      // finalize
      setThreadMute(rootUri, finalIsMuted);
    },
  });

  const queueMuteThread = useCallback(() => {
    // optimistically update
    setThreadMute(rootUri, true);
    return queueToggle(true);
  }, [setThreadMute, rootUri, queueToggle]);

  const queueUnmuteThread = useCallback(() => {
    // optimistically update
    setThreadMute(rootUri, false);
    return queueToggle(false);
  }, [rootUri, setThreadMute, queueToggle]);

  return [isThreadMuted, queueMuteThread, queueUnmuteThread] as const;
}

/**
 * Hook for thread mute mutation
 */
function useThreadMuteMutation() {
  const agent = useAgent();
  return useMutation<
    {},
    Error,
    { uri: string } // the root post's uri
  >({
    mutationFn: ({ uri }) => {
      logger.metric('post:mute', {});
      return agent.api.app.bsky.graph.muteThread({ root: uri });
    },
  });
}

/**
 * Hook for thread unmute mutation
 */
function useThreadUnmuteMutation() {
  const agent = useAgent();
  return useMutation<{}, Error, { uri: string }>({
    mutationFn: ({ uri }) => {
      logger.metric('post:unmute', {});
      return agent.api.app.bsky.graph.unmuteThread({ root: uri });
    },
  });
}

/**
 * Convert gRPC note to REST post format for compatibility
 */
function convertGrpcNoteToRestPost(note: any): AppBskyFeedDefs.PostView {
  return {
    uri: `at://${note.authorId}/app.bsky.feed.post/${note.id}`,
    cid: note.id, // Use note ID as CID for now
    record: {
      $type: 'app.bsky.feed.post',
      text: note.text,
      createdAt: new Date(note.createdAt.seconds * 1000).toISOString(),
      // Add other fields as needed
    },
    author: {
      did: note.authorId,
      handle: '', // Extract from user profile
      displayName: '',
      avatar: '',
      viewer: {
        muted: false,
        mutedByList: false,
        blockedBy: false,
        blocking: '',
        following: '',
        followedBy: '',
      },
    },
    replyCount: note.metrics.replyCount,
    repostCount: note.metrics.renoteCount,
    likeCount: note.metrics.likeCount,
    indexedAt: new Date(note.createdAt.seconds * 1000).toISOString(),
    viewer: {
      repost: undefined,
      like: undefined,
    },
  };
}