import { Client } from "@elastic/elasticsearch";
import dotenv from 'dotenv';
dotenv.config();
const elastic = new Client({
  node: process.env.ELASTIC_SEARCH,
  auth: { apiKey: process.env.ELASTIC_SEARCH_API },
});

// ✅ 랜덤 카테고리, 지역코드, 날짜 생성
const categories = ["여행기록", "기념품", "여행지", "여행 코디"];
const getRandomCategory = () => categories[Math.floor(Math.random() * categories.length)];
const getRandomRegionCode = () => Math.floor(Math.random() * 100) + 1;
const getRandomDate = () => new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString();

/**
 * ✅ Elasticsearch에 임의의 데이터 추가
 */
async function addTestDataToElastic() {
  for (let threadId = 92; threadId <= 99; threadId++) {
    const doc = {
      threadId: threadId,
      category: getRandomCategory(),
      postTitle: `테스트 게시물 ${threadId}`,
      postContent: `이것은 ${threadId}번째 테스트 게시물입니다.`,
      postDate: getRandomDate(),
      postRegionCode: getRandomRegionCode(),
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 50),
    };

    try {
      await elastic.index({
        index: "post_stats",
        id: threadId.toString(),
        document: doc,
      });

      console.log(`✅ threadId=${threadId} 추가 완료`);
    } catch (error) {
      console.error(`❌ threadId=${threadId} 추가 실패:`, error);
    }
  }

  console.log("🎉 모든 데이터 삽입 완료!");
}

// 🚀 실행
addTestDataToElastic();
