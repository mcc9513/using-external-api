document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const query = document.getElementById('query').value;
    const resultsContainer = document.getElementById('results');
    resultsContainer.textContent = 'Loading...';
  
    try {
      const response = await fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keyword: query })
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      resultsContainer.innerHTML = '';
  
      if (data.length === 0) {
        resultsContainer.textContent = 'No results found.';
      } else {
        data.forEach(track => {
          const trackElement = document.createElement('div');
          trackElement.className = 'track';
          trackElement.innerHTML = `<strong>${track.title}</strong> by ${track.subtitle}`;
          resultsContainer.appendChild(trackElement);
        });
      }
    } catch (error) {
      resultsContainer.textContent = `Error: ${error.message}`;
    }
  });
  