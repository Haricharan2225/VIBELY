import Playlist from '../models/Playlist.js';
import Song from '../models/Song.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Get user's playlists and public playlists
 * GET /api/playlists
 */
export const getUserPlaylists = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Return owner's playlists + public playlists
    const playlists = await Playlist.find({
      $or: [
        { owner: userId },
        { isPublic: true }
      ]
    })
      .populate('owner', 'displayName profileImage')
      .populate({
        path: 'songs',
        select: 'title duration coverUrl audioUrl',
        populate: { path: 'artist', select: 'name' }
      })
      .sort({ updatedAt: -1 })
      .lean();

    return successResponse(res, playlists, 'Playlists retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Get playlist by ID
 * GET /api/playlists/:id
 */
export const getPlaylistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id?.toString();

    const playlist = await Playlist.findById(id)
      .populate('owner', 'displayName profileImage')
      .populate({
        path: 'songs',
        populate: [
          { path: 'artist', select: 'name image bio verified' },
          { path: 'album', select: 'title coverUrl releaseDate' }
        ]
      })
      .lean();

    if (!playlist) {
      return errorResponse(res, 'Playlist not found', 404);
    }

    // Check visibility: public or owned by requester
    if (!playlist.isPublic && playlist.owner?._id?.toString() !== userId) {
      return errorResponse(res, 'Access denied. This playlist is private.', 403);
    }

    return successResponse(res, playlist, 'Playlist retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new playlist
 * POST /api/playlists
 */
export const createPlaylist = async (req, res, next) => {
  try {
    const { name, description, coverUrl, isPublic, songs } = req.body;
    const userId = req.user._id;

    const playlist = await Playlist.create({
      name,
      description: description || '',
      coverUrl: coverUrl || '',
      owner: userId,
      songs: Array.isArray(songs) ? songs : [],
      isPublic: isPublic !== undefined ? isPublic : true
    });

    const populatedPlaylist = await Playlist.findById(playlist._id)
      .populate('owner', 'displayName profileImage')
      .lean();

    return successResponse(res, populatedPlaylist, 'Playlist created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing playlist (owner only)
 * PUT /api/playlists/:id
 */
export const updatePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, coverUrl, isPublic } = req.body;
    const userId = req.user._id.toString();

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return errorResponse(res, 'Playlist not found', 404);
    }

    if (playlist.owner.toString() !== userId) {
      return errorResponse(res, 'Forbidden: You do not own this playlist', 403);
    }

    if (name !== undefined) playlist.name = name.trim();
    if (description !== undefined) playlist.description = description.trim();
    if (coverUrl !== undefined) playlist.coverUrl = coverUrl;
    if (isPublic !== undefined) playlist.isPublic = isPublic;
    playlist.updatedAt = new Date();

    await playlist.save();

    const updated = await Playlist.findById(id)
      .populate('owner', 'displayName profileImage')
      .populate({
        path: 'songs',
        populate: { path: 'artist', select: 'name' }
      })
      .lean();

    return successResponse(res, updated, 'Playlist updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a playlist (owner only)
 * DELETE /api/playlists/:id
 */
export const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return errorResponse(res, 'Playlist not found', 404);
    }

    if (playlist.owner.toString() !== userId) {
      return errorResponse(res, 'Forbidden: You do not own this playlist', 403);
    }

    await Playlist.findByIdAndDelete(id);

    return successResponse(res, { id }, 'Playlist deleted successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Add a song to playlist (owner only)
 * POST /api/playlists/:id/songs
 */
export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { songId } = req.body;
    const userId = req.user._id.toString();

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return errorResponse(res, 'Playlist not found', 404);
    }

    if (playlist.owner.toString() !== userId) {
      return errorResponse(res, 'Forbidden: You do not own this playlist', 403);
    }

    // Verify song exists
    const songExists = await Song.exists({ _id: songId });
    if (!songExists) {
      return errorResponse(res, 'Song not found', 404);
    }

    // Check if song already in playlist
    const alreadyAdded = playlist.songs.some((s) => s.toString() === songId.toString());
    if (alreadyAdded) {
      return errorResponse(res, 'Song is already in this playlist', 409);
    }

    playlist.songs.push(songId);
    playlist.updatedAt = new Date();
    await playlist.save();

    const updated = await Playlist.findById(id)
      .populate('owner', 'displayName profileImage')
      .populate({
        path: 'songs',
        populate: [
          { path: 'artist', select: 'name image' },
          { path: 'album', select: 'title coverUrl' }
        ]
      })
      .lean();

    return successResponse(res, updated, 'Song added to playlist', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove a song from playlist (owner only)
 * DELETE /api/playlists/:id/songs/:songId
 */
export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { id, songId } = req.params;
    const userId = req.user._id.toString();

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return errorResponse(res, 'Playlist not found', 404);
    }

    if (playlist.owner.toString() !== userId) {
      return errorResponse(res, 'Forbidden: You do not own this playlist', 403);
    }

    playlist.songs = playlist.songs.filter((s) => s.toString() !== songId.toString());
    playlist.updatedAt = new Date();
    await playlist.save();

    const updated = await Playlist.findById(id)
      .populate('owner', 'displayName profileImage')
      .populate({
        path: 'songs',
        populate: [
          { path: 'artist', select: 'name image' },
          { path: 'album', select: 'title coverUrl' }
        ]
      })
      .lean();

    return successResponse(res, updated, 'Song removed from playlist', 200);
  } catch (error) {
    next(error);
  }
};
