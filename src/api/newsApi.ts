import { News } from "../interfaces/news";

const API_BASE_URL = process.env.REACT_APP_API_URL;

// GET News
export const fetchNews = async (): Promise<News[]> => {
  const response = await fetch(`${API_BASE_URL}/News`);
  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  
  const data: News[] = await response.json();

  // Sorting the news
  const sortedNews = data.sort((a, b) => {
      const aPublishedAt = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bPublishedAt = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      
      // Sorting news by descending order
      return bPublishedAt - aPublishedAt;
  });

  return sortedNews;
};

// CREATE News
export const createNews = async (news: { title: string; content: string; imageFile?: File }): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) {
      alert("Et ole kirjautunut sisään!");
      return;
  }

  let imageData = "";

  if (news.imageFile instanceof File) {
      const reader = new FileReader();

      const imagePromise = new Promise<string>((resolve) => {
          reader.onload = () => {
              const base64Data = reader.result?.toString().split(",")[1] || "";
              resolve(base64Data);
          };
          reader.readAsDataURL(news.imageFile as File);
      });

      imageData = await imagePromise;
  }

  const response = await fetch(`${API_BASE_URL}/News`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
          title: news.title,
          content: news.content,
          imageDataBase64: imageData || undefined
      }),
  });

  if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Uutisen luonti epäonnistui: ${errorText}`);
  }
};

// UPDATE News
export const updateNews = async (id: number, title: string, content: string): Promise<void> => {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Et ole kirjautunut sisään!");
    return;
  }

  const response = await fetch(`${API_BASE_URL}/News/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
      throw new Error("Uutisen päivitys epäonnistui");
    }
};

// DELETE News
export const deleteNews = async (id: number): Promise<void> => {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Et ole kirjautunut sisään!");
    return;
  }

  const response = await fetch(`${API_BASE_URL}/News/${id}`, {
      method: "DELETE",
      headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Uutisen poistaminen epäonnistui");
  }
};