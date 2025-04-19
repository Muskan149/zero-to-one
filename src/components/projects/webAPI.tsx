export const postArticles = async (query: string) => {
  try {
    const response = await fetch("http://localhost:8000/api/postArticles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    console.log("POST Articles:", data);
  } catch (error) {
    console.error("Error posting articles:", error);
  }
};

export const postVideos = async (query: string) => {
  try {
    const response = await fetch("http://localhost:8000/api/postVideos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    console.log("POST Videos:", data);
  } catch (error) {
    console.error("Error posting videos:", error);
  }
};
