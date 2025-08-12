import type React from "react"
import axios from "axios"
import crypto from "crypto"


const ENV = {
  QOBUZ_API_BASE: "https://www.qobuz.com/api.json/0.2/",
  QOBUZ_APP_ID: "798273057",
  QOBUZ_SECRET: "abb21364945c0583309667d13ca3d93a",
  QOBUZ_AUTH_TOKENS: ["-6MoVR8hli5CDAhNuEaMmAC1MYyYV9OTpi3uU4Nv39BMYNsGlCAcDQAJsKVyKqDvyc8IOGR2YxM4_4hfHNsy9w"],
  NEXT_PUBLIC_GITHUB: "https://github.com/sheikhlipu123/Qobuz-DL-API",
  NEXT_PUBLIC_DISCORD: "https://discord.gg/EBKcDZwEHJ",
  NEXT_PUBLIC_APPLICATION_NAME: "Qobuz-DL API",
}


export type QobuzGenre = {
  path: number[]
  color: string
  name: string
  id: number
}

export type QobuzLabel = {
  name: string
  id: number
  albums_count: number
}

export type QobuzArtist = {
  image: string | null
  name: string
  id: number
  albums_count: number
}

export type QobuzTrack = {
  isrc: string | null
  copyright: string
  maximum_bit_depth: number
  maximum_sampling_rate: number
  performer: {
    name: string
    id: number
  }
  album: QobuzAlbum
  track_number: number
  released_at: number
  title: string
  version: string | null
  duration: number
  parental_warning: boolean
  id: number
  hires: boolean
  streamable: boolean
  media_number: number
}

export type QobuzAlbum = {
  maximum_bit_depth: number
  image: {
    small: string
    thumbnail: string
    large: string
    back: string | null
  }
  artist: QobuzArtist
  artists: {
    id: number
    name: string
    roles: string[]
  }[]
  released_at: number
  label: QobuzLabel
  title: string
  qobuz_id: number
  version: string | null
  duration: number
  parental_warning: boolean
  tracks_count: number
  genre: QobuzGenre
  id: string
  maximum_sampling_rate: number
  release_date_original: string
  hires: boolean
  upc: string
  streamable: boolean
}

export type QobuzSearchResults = {
  query: string
  albums: {
    limit: number
    offset: number
    total: number
    items: QobuzAlbum[]
  }
  tracks: {
    limit: number
    offset: number
    total: number
    items: QobuzTrack[]
  }
}

export type FetchedQobuzAlbum = {
  tracks: {
    items: QobuzTrack[]
  }
  upc: string
}

// Core API functions
export function getRandomToken() {
  return ENV.QOBUZ_AUTH_TOKENS[Math.floor(Math.random() * ENV.QOBUZ_AUTH_TOKENS.length)] as string
}

export async function search(query: string, limit = 10, offset = 0) {
  testForRequirements()
  const url = new URL(ENV.QOBUZ_API_BASE + "catalog/search")
  url.searchParams.append("query", query)
  url.searchParams.append("limit", limit.toString())
  url.searchParams.append("offset", offset.toString())
  const response = await axios.get(url.toString(), {
    headers: {
      "x-app-id": ENV.QOBUZ_APP_ID,
      "x-user-auth-token": getRandomToken(),
    },
  })
  return response.data as QobuzSearchResults
}

export async function getDownloadURL(trackID: number, quality: string) {
  testForRequirements()
  const timestamp = Math.floor(new Date().getTime() / 1000)
  const r_sig = `trackgetFileUrlformat_id${quality}intentstreamtrack_id${trackID}${timestamp}${ENV.QOBUZ_SECRET}`
  const r_sig_hashed = crypto.createHash("md5").update(r_sig).digest("hex")
  const url = new URL(ENV.QOBUZ_API_BASE + "track/getFileUrl")
  url.searchParams.append("format_id", quality)
  url.searchParams.append("intent", "stream")
  url.searchParams.append("track_id", trackID.toString())
  url.searchParams.append("request_ts", timestamp.toString())
  url.searchParams.append("request_sig", r_sig_hashed)
  const response = await axios.get(url.toString(), {
    headers: {
      "x-app-id": ENV.QOBUZ_APP_ID,
      "x-user-auth-token": getRandomToken(),
    },
  })
  return response.data.url
}

export async function getAlbumInfo(album_id: string) {
  testForRequirements()
  const url = new URL(ENV.QOBUZ_API_BASE + "album/get")
  url.searchParams.append("album_id", album_id)
  url.searchParams.append("extra", "track_ids")
  const response = await axios.get(url.toString(), {
    headers: {
      "x-app-id": ENV.QOBUZ_APP_ID,
      "x-user-auth-token": getRandomToken(),
    },
  })
  return response.data
}

export function testForRequirements() {
  if (ENV.QOBUZ_APP_ID.length === 0) throw new Error("Missing QOBUZ_APP_ID environment variable.")
  if (ENV.QOBUZ_AUTH_TOKENS.length === 0) throw new Error("Missing QOBUZ_AUTH_TOKENS environment variable.")
  if (ENV.QOBUZ_SECRET.length === 0) throw new Error("Missing QOBUZ_SECRET environment variable.")
  if (ENV.QOBUZ_API_BASE.length === 0) throw new Error("Missing QOBUZ_API_BASE environment variable.")
  return true
}

export function formatArtists(result: QobuzAlbum | QobuzTrack): string {
  if ((result as QobuzTrack).album) {
    return (
      (result as QobuzTrack).album.artists?.map((artist) => artist.name).join(", ") ||
      (result as QobuzTrack).performer.name
    )
  } else {
    return (result as QobuzAlbum).artists?.map((artist) => artist.name).join(", ") || (result as QobuzAlbum).artist.name
  }
}

export function formatTitle(result: QobuzAlbum | QobuzTrack): string {
  return result.title + (result.version ? ` (${result.version})` : "")
}

export function getAlbum(result: QobuzAlbum | QobuzTrack): QobuzAlbum {
  return (result as QobuzTrack).album ? (result as QobuzTrack).album : (result as QobuzAlbum)
}

export async function getFullAlbumInfo(
  fetchedAlbumData: FetchedQobuzAlbum | null,
  setFetchedAlbumData: React.Dispatch<React.SetStateAction<FetchedQobuzAlbum | null>>,
  result: QobuzAlbum,
): Promise<FetchedQobuzAlbum> {
  if (!fetchedAlbumData || fetchedAlbumData.tracks.items.length === 0) {
    const albumData = await getAlbumInfo(result.id)
    setFetchedAlbumData(albumData)
    return albumData
  }
  return fetchedAlbumData
}

export async function getFullResImage(result: QobuzAlbum | QobuzTrack): Promise<string> {
  const album = getAlbum(result)
  return album.image.large
}

export function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60)
  const seconds = Math.floor(duration % 60)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export const filterExplicit = (results: QobuzSearchResults, explicitContent: boolean): QobuzSearchResults => {
  if (explicitContent) return results
  return {
    ...results,
    albums: {
      ...results.albums,
      items: results.albums.items.filter((album) => !album.parental_warning),
    },
    tracks: {
      ...results.tracks,
      items: results.tracks.items.filter((track) => !track.parental_warning),
    },
  }
}

