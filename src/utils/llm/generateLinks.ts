const options = {
    method: 'POST',
    headers: {Authorization: 'Bearer <token>', 'Content-Type': 'application/json'},
    body: '{"model":"sonar","messages":[{"role":"system","content":"Be precise and concise."},{"role":"user","content":"How many stars are there in our galaxy?"}]}'
  };
  
  fetch('https://api.perplexity.ai/chat/completions', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));