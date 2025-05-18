export const fetchArticles = async (query: string) => {
  try {
    // const link = "https://zero-to-one-backend-203a1e496967.herokuapp.com/api/postArticles";
    const link = "http://localhost:8000/api/postArticles";
    const response = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    console.log("Fetched articles:", data);
    return data;
  } catch (error: any) {
    console.error("Error fetching articles:", error);
    return { error: error.message || "An unknown error occurred" };
  }
};

export const fetchVideos = async (query: string) => {
  // const link = "https://zero-to-one-backend-203a1e496967.herokuapp.com/api/postVideo";
  const link = "http://localhost:8000/api/postVideos";
  try {
    const response = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    console.log("Fetched videos:", data);
    return data;
  } catch (error: any) {
    console.error("Error fetching videos:", error);
    return { error: error.message || "An unknown error occurred" };
  }
};
