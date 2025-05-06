import logo from './logo.svg';
import './App.css';
import {useCallback, useState} from "react";
import {Alert, Button, Input, List, Spin} from "antd";

function App() {
  const [originalUrl, setoriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [allUrls, setAllUrls] = useState([]);
  const [showStats, setShowStats] = useState(null);
  const [statsUrl, setStatsUrl] = useState('');
  const [levelOneResponse, setLevelOneResponse] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api'; //  Make sure your server is running at the same origin, or update with full URL

  const handleEncode = useCallback(async () => {
    if (!originalUrl.trim()) {
      setError('Please enter a URL to shorten.');
      return;
    }
    setError('');
    setLoading(true);
    setShortUrl(''); // Clear previous short URL
    try {
      const response = await fetch(`${API_BASE_URL}/encode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to shorten URL');
      }

      // const data = await response.json();
      // setShortUrl(data.shortUrl);
      setLevelOneResponse(await response.text())
    } catch (err) {
      setError(err.message || 'An error occurred while shortening the URL.');
    } finally {
      setLoading(false);
    }
  }, [originalUrl, API_BASE_URL]);

  const handleDecode = useCallback(async (shortUrlToDecode) => {
      if (!shortUrlToDecode.trim()) {
          setError('Please enter a short URL to decode');
          return;
      }
      setError('');
      setLoading(true);
      try {
          // const response = await fetch(`${API_BASE_URL}/decode?shortUrl=${shortUrlToDecode}`);
          // if (!response.ok) {
          //     const errorData = await response.json();
          //     throw new Error(errorData.message || 'Failed to decode');
          // }
          // const data = await response.json();
          // setoriginalUrl(data.originalUrl);
          const response = await fetch(`${API_BASE_URL}/decode`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ shortUrl: shortUrlToDecode }),
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to shorten URL');
          }
          const data = await response.json();
          setoriginalUrl(data.originalUrl);
      } catch (err) {
          setError(err.message || 'An error occurred while decoding the URL.');
      } finally {
          setLoading(false);
      }
  }, [API_BASE_URL]);

  const handleListUrls = useCallback(async () => {
    setError('');
    setLoading(true);
    setAllUrls([]); // Clear previous list
    try {
      const response = await fetch(`${API_BASE_URL}/list`);
      if (!response.ok) {
        throw new Error('Failed to fetch URL list');
      }
      const data = await response.json();
      setAllUrls(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the list.');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const handleGetStats = useCallback(async () => {
      if (!statsUrl.trim()) {
          setError("Please enter a short URL to get statistics");
          return;
      }
      setError('');
      setLoading(true);
      setShowStats(null);
      try {
          const response = await fetch(`${API_BASE_URL}/statistic/${statsUrl}`);
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to fetch Stats');
          }
          const data = await response.json();
          setShowStats({
              url: statsUrl,
              visits: data.visits,
              createdAt: new Date(data.createdAt).toLocaleString(),
          });
      } catch (err) {
          setError(err.message || 'An error occurred while fetching the stats.');
      } finally {
          setLoading(false);
      }
  }, [API_BASE_URL, statsUrl]);

  return (
    <div className="pl-12 pr-12 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          ShortLink URL Shortener
        </h1>

        <div className="bg-gray-900/80 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-200">Shorten a URL</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="url"
              placeholder="Enter URL to shorten (e.g., https://www.example.com)"
              value={originalUrl}
              onChange={(e) => setoriginalUrl(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              disabled={loading}
            />
            <Button
              onClick={handleEncode}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md transition-colors duration-200"
              disabled={loading}
            >
              {loading ? (
                  <>
                      <Spin tip="Loading..." className="mr-2 h-4 w-4 animate-spin" />
                      Shortening...
                  </>
              ) : (
                'Shorten'
              )}
            </Button>
          </div>
            { levelOneResponse}
          {levelOneResponse && (
            <div className="bg-gray-800 rounded-md p-4 border border-gray-700">
              <p className="text-gray-300">Shortened URL:</p>
              <a
                href={`/${shortUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-medium break-all"
              >
                {`http://localhost:5000/${shortUrl}`}
              </a>
            </div>
          )}
        </div>

        <div className="bg-gray-900/80 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-200">Decode a Short URL</h2>
            <div className="flex flex-col sm:flex-row gap-3">
                <Input
                type="text"
                placeholder="Enter short URL to decode (e.g., GeAi9K)"
                value={shortUrl}
                onChange={(e) => setShortUrl(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                disabled={loading}
                />
                <Button
                onClick={() => handleDecode(shortUrl)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-md transition-colors duration-200"
                disabled={loading}
                >
                {loading ? (

                    <>
                        <Spin tip="Loading..." className="mr-2 h-4 w-4 animate-spin" />
                        Decoding...
                    </>
                ) : (
                    'Decode'
                )}
                </Button>
            </div>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-200">
            List All Shortened URLs
          </h2>
          <Button
            onClick={handleListUrls}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-md transition-colors duration-200"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spin tip="Loading..." className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <List className="mr-2 h-4 w-4" />
                List URLs
              </>
            )}
          </Button>
          {allUrls.length > 0 && (
            <div className="space-y-2">
              {allUrls.map((item) => (
                <div
                  key={item.shortUrl}
                  className="bg-gray-800 rounded-md p-4 border border-gray-700 flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-300">Short URL:</p>
                    <a
                      href={`/${item.shortUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-medium break-all"
                    >
                      {`${window.location.origin}/${item.shortUrl}`}
                    </a>
                  </div>
                  <div>
                    <p className="text-gray-300">Long URL:</p>
                    <a
                      href={item.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 font-medium break-all"
                    >
                      {item.originalUrl}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-900/80 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-200">
                Get Short URL Statistics
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
                <Input
                type="text"
                placeholder="Enter short URL (e.g., GeAi9K)"
                value={statsUrl}
                onChange={(e) => setStatsUrl(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                disabled={loading}
                />
                <Button
                onClick={handleGetStats}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-3 rounded-md transition-colors duration-200"
                disabled={loading}
                >
                {loading ? (
                    <>
                    <Spin tip="Loading..." className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                    </>
                ) : (
                    <>
                    <span className="mr-2 h-4 w-4" />
                    Show Stats
                    </>
                )}
                </Button>
            </div>
            {showStats && (
                <div className="bg-gray-800 rounded-md p-4 border border-gray-700 space-y-2">
                <p className="text-gray-300">Short URL: <span className="text-blue-400 font-medium">{showStats.url}</span></p>
                <p className="text-gray-300">Visits: <span className="text-yellow-400 font-medium">{showStats.visits}</span></p>
                <p className="text-gray-300">Created At: <span className="text-purple-400 font-medium">{showStats.createdAt}</span></p>
                </div>
            )}
            </div>

        {/*{error && (*/}
        {/*  <Alert variant="destructive" className="bg-red-500/10 border-red-500 text-red-400"*/}
        {/*         message="Error"*/}
        {/*         description="An error occurred: ."*/}
        {/*         type="error"/>*/}
        {/*)}*/}
      </div>
    </div>
  );
}

export default App;
