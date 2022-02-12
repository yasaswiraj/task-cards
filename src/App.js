import "./App.css";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Gif } from "@giphy/react-components";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

const giphyFetch = new GiphyFetch("sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh");

function App() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  var interval = null;
  const [offset, setOffset] = useState(0);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    getImages();
    return () => clearTimeout(interval);
  }, [offset]);

  const getImages = async () => {
    if (searchText.length === 0) {
      await giphyFetch.trending({ offset, limit: 12 }).then(async (res) => {
        interval = setTimeout(() => {
          setData(res.data);
          setOffset(offset + 12);
        }, 5000);
      });
    } else {
      await giphyFetch
        .search(searchText, { offset, limit: 12 })
        .then(async (res) => {
          setData(res.data);
        });
    }
  };

  const fetchedGifs = data.map((gif) => {
    return (
      <div key={data.indexOf(gif)} className="my-2 col col-md-6 col-lg-4">
        <div className="card">
          <div className="card-body">
            <Gif gif={gif} />
          </div>
        </div>
      </div>
    );
  });
  const updateText = (e) => {
    setSearchText(e.target.value);
    if (searchText.length === 0) getImages(0);
  };
  return (
    <div className="container p-5">
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Type here"
          onChange={(e) => updateText(e)}
        />
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            onClick={getImages(0)}
          >
            search
          </button>
        </div>
      </div>
      <div className="row">{fetchedGifs}</div>
    </div>
  );
}

export default App;
