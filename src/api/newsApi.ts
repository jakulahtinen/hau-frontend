export interface News {
  Title: string;
  Content: string;
  PublishedAt?: Date;
}

export async function createNews(news: News): Promise<Response> {
  const response = await fetch((`${process.env.REACT_APP_API_URL}/News`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(news),
  });

  if (!response.ok) {
    throw new Error("Uutisen luonti epäonnistui");
  }

  return response;
}