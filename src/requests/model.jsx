import React, { useState } from 'react';

const apiUrl ="";

const ApiPostComponent = ({ apiUrl, postData }) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const postDataToApi = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResponse(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Optionally, you can trigger the POST request on component mount or based on specific conditions by using useEffect hook
  // useEffect(() => {
  //   postDataToApi();
  // }, [apiUrl, postData]); // Add dependencies array if you want to control when the effect runs

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
      <button onClick={postDataToApi}>Post Data</button>
    </div>
  );
};

export default ApiPostComponent;
