import { keywordGenerator } from '@/utils/llm/keywordGenerator';
import { fetchArticles, fetchVideos } from '../scrapers/webAPI';
import { RoadmapStep } from '@/lib/types.js';
import { ArticleJSON, VideoJSON } from '@/lib/types.js';
import { generateLinks } from './generateLinks';

export async function generateLinksForRoadmap(roadmapData: RoadmapStep[], add_articles: boolean = true, add_videos: boolean = true) {
  console.log("Entered generateLinksForRoadmap function with roadmapData:", roadmapData);
  
  if (!roadmapData || roadmapData.length === 0) {
    console.error('No roadmap data provided');
    return [];
  }

  // const keywordResponse = await keywordGenerator(roadmapData);
  // if (!keywordResponse || !keywordResponse.success) {
  //   console.error('Error fetching keywords:', keywordResponse);
  //   return [];
  // } 

  // const keywords = Object.values(keywordResponse.data) as string[];

  // console.log("About to call postArticles with keywords: ", keywords);

  // let videosWithUrl: string[][] = [];
  // if (add_videos) {
  //   // Fetch videos for each keyword using fetchVideos
  //   videosWithUrl = await Promise.all(  
  //     keywords.map(async (keyword) => {
  //       console.log("keyword: ", keyword);
  //       const videos = await fetchVideos(keyword);
  //       console.log("videos: ", videos);
  //       if (Array.isArray(videos)) {
  //         return videos.map((video: VideoJSON) => (
  //           video.title + "#$#" + video.url
  //         ));
  //       } else {
  //         console.log(`No videos found for "${keyword}"`);
  //         return [];
  //       }
  //     })
  // );}

  // let articlesWithUrl: string[][] = [];
  // if (add_articles) {
  //   // Fetch articles for each keyword using fetchArticles
  //   articlesWithUrl = await Promise.all(
  //     keywords.map(async (keyword) => {
  //       console.log("keyword: ", keyword);
  //     const articles = await fetchArticles(keyword);
  //     if (articles && Array.isArray(articles)) {
  //       return articles.map((article: ArticleJSON) => (
  //         article.title + "#$#" + article.url
  //       ));
  //     } else {
  //         console.log(`No articles found for "${keyword}"`);
  //         return [];
  //       }
  //     })
  //   );
  // }


  // console.log("articlesWithUrl: " , articlesWithUrl)
  // console.log("videosWithUrl: " , videosWithUrl)

  const urls = generateLinks(roadmapData)
  
  const stepsWithLinks = [];

  for (let i = 0; i < roadmapData.length; i++) {
  // Create a new step with the heading, description, and articles and videos (RoadmapStep)
    const step = roadmapData[i];
    const heading = step.heading;
    const description = step.description;
    const link = urls[i] | []
    const articles = articlesWithUrl[i] || [];
    const videos = videosWithUrl[i] || [];
    
    stepsWithLinks.push({
      heading,
      description,
      articles,
      videos,
    });
  }

  console.log('Roadmap steps with links:', stepsWithLinks);
  
  return stepsWithLinks as RoadmapStep[];
}
