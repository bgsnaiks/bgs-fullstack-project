import React, { useEffect, useState } from 'react';

function Cards() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/posts')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error('Frontend Error:', err));
  }, []);

  return (
    <div className="container py-4">
      <h1 className="mb-4">API Data</h1>
      {data.length > 0 ? (
        <div className="row">
          {data.map(item => (
            <div className="col-md-4 mb-4" key={item.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={`https://picsum.photos/300/200?random=${item.id}`}
                  className="card-img-top"
                  alt="Random"
                />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.body}</p>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <small className="text-muted">User ID: {item.userId}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (

        <div class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
      )}
    </div>
  );
}

export default Cards;
