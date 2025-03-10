import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Qobuz-DL API</h1>

      <div className="mb-8">
        <p className="mb-4">
          This is a simple API for searching and downloading music from Qobuz. All endpoints return JSON responses.
        </p>
        <p className="mb-4">
          This project is a fork of{" "}
          <Link href="https://github.com/QobuzDL/Qobuz-DL" className="text-blue-500 hover:underline">
            Qobuz-DL
          </Link>
          .
        </p>
        <div className="flex space-x-4">
          <Link href="https://github.com/sheikhlipu123/Qobuz-DL-API" className="text-blue-500 hover:underline">
            GitHub
          </Link>
          <Link href="https://discord.gg/EBKcDZwEHJ" className="text-blue-500 hover:underline">
            Discord
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Search</h2>
          <p className="mb-2">Search for albums and tracks on Qobuz.</p>
          <div className="bg-gray-100 p-2 rounded mb-2">
            <code>GET /api/get-music?q=query&offset=0&limit=10</code>
          </div>
          <div>
            <p className="font-medium">Parameters:</p>
            <ul className="list-disc pl-6">
              <li>
                <code>q</code> (required): Search query
              </li>
              <li>
                <code>offset</code> (optional): Pagination offset (default: 0)
              </li>
              <li>
                <code>limit</code> (optional): Number of results per page (default: 10, max: 50)
              </li>
            </ul>
          </div>
        </div>

        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Get Album</h2>
          <p className="mb-2">Get detailed information about an album, including tracks.</p>
          <div className="bg-gray-100 p-2 rounded mb-2">
            <code>GET /api/get-album?album_id=album_id</code>
          </div>
          <div>
            <p className="font-medium">Parameters:</p>
            <ul className="list-disc pl-6">
              <li>
                <code>album_id</code> (required): Qobuz album ID
              </li>
            </ul>
          </div>
        </div>

        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Get Download URL</h2>
          <p className="mb-2">Get a download URL for a track.</p>
          <div className="bg-gray-100 p-2 rounded mb-2">
            <code>GET /api/download-music?track_id=track_id&quality=27</code>
          </div>
          <div>
            <p className="font-medium">Parameters:</p>
            <ul className="list-disc pl-6">
              <li>
                <code>track_id</code> (required): Qobuz track ID
              </li>
              <li>
                <code>quality</code> (optional): Quality ID (default: 27)
                <ul className="list-disc pl-6">
                  <li>27: 24-bit / 192kHz</li>
                  <li>7: 24-bit / 96kHz</li>
                  <li>6: 16-bit / 44.1kHz</li>
                  <li>5: MP3 320kbps</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Example Usage</h2>
        <div className="bg-gray-100 p-4 rounded">
          <pre className="whitespace-pre-wrap">
            {`// Search for music
fetch('/api/get-music?q=daft+punk&limit=5')
  .then(response => response.json())
  .then(data => console.log(data));

// Get album details
fetch('/api/get-album?album_id=0060254783339')
  .then(response => response.json())
  .then(data => console.log(data));

// Get download URL for a track
fetch('/api/download-music?track_id=52155495&quality=27')
  .then(response => response.json())
  .then(data => console.log(data));`}
          </pre>
        </div>
      </div>
    </div>
  )
}

