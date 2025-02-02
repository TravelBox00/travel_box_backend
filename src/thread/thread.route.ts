import { Router } from 'express';
import multer from 'multer';
import {
  deletePostController,
  myPostCategoryController,
  myPostSearchController,
  popularPostController,
  postInfoController,
  postSearchController,
  updatePostController,
  upLoadPostController,
  toggleLike,
  toggleScrap,
  getScrappedThreads,
} from './thread.controller.ts';

const router = Router();
const upload = multer(); // multer 미들웨어 설정정

router.get('/', (req, res) => {
  res.send('Thread Main Route');
});

/**
 * @swagger
 * tags:
 *   - name: Thread
 *     description: 게시물 관련 API
 */

// eslint-disable-next-line import/extensions

/**
 * @swagger
 * /thread/like:
 *   post:
 *     summary: 게시물 좋아요
 *     description: 좋아요 추가 시 isLiked가 true, 취소 시 isLiked가 false로 반환됩니다.
 *     tags:
 *       - Thread
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               threadId:
 *                 type: integer
 *                 description: 게시물 ID
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 description: 사용자 ID
 *                 example: 1
 *     responses:
 *       200:
 *         description: 현재 좋아요 상태 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   description: 요청 성공 여부
 *                   example: true
 *                 code:
 *                   type: string
 *                   description: 상태 코드
 *                   example: "2000"
 *                 message:
 *                   type: string
 *                   description: 처리 결과 메시지
 *                   example: "좋아요 성공"
 *                 result:
 *                   type: object
 *                   properties:
 *                     isLiked:
 *                       type: boolean
 *                       description: 현재 좋아요 상태
 *                       example: true
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /thread/scrap:
 *   post:
 *     summary: 게시물 스크랩
 *     description: 스크랩 추가 시 result.isScrapped가 true, 취소 시 result.isScrapped가 false로 반환됩니다.
 *     tags:
 *       - Thread
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               threadId:
 *                 type: integer
 *                 description: 게시물 ID
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 description: 사용자 ID
 *                 example: 1
 *     responses:
 *       200:
 *         description: 현재 스크랩 상태 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   description: 요청 성공 여부
 *                   example: true
 *                 code:
 *                   type: string
 *                   description: 상태 코드
 *                   example: "2000"
 *                 message:
 *                   type: string
 *                   description: 처리 결과 메시지
 *                   example: "스크랩 성공"
 *                 result:
 *                   type: object
 *                   properties:
 *                     isScrapped:
 *                       type: boolean
 *                       description: 현재 스크랩 상태
 *                       example: true
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /thread/scrap/info:
 *   get:
 *     summary: 스크랩한 게시물 목록 조회
 *     description: 게시물의 제목, 내용, 작성자 닉네임, 스크랩 상태, 사진 경로 반환
 *     tags:
 *       - Thread
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 스크랩한 게시물 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   description: 요청 성공 여부
 *                   example: true
 *                 code:
 *                   type: string
 *                   description: 상태 코드
 *                   example: "2000"
 *                 message:
 *                   type: string
 *                   description: 처리 결과 메시지
 *                   example: "스크랩한 게시물 목록 조회 성공"
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       threadId:
 *                         type: integer
 *                         description: 게시물 ID
 *                         example: 1
 *                       postTitle:
 *                         type: string
 *                         description: 게시물 제목
 *                         example: "Exploring Paris"
 *                       postContent:
 *                         type: string
 *                         description: 게시물 내용
 *                         example: "I visited Paris and it was breathtaking!"
 *                       userNickname:
 *                         type: string
 *                         description: 작성자 닉네임
 *                         example: "JohnDoe"
 *                       isScrapped:
 *                         type: boolean
 *                         description: 스크랩 여부
 *                         example: true
 *                       photoUrl:
 *                         type: string
 *                         description: 사진 경로
 *                         example: "https://example.com/image.jpg"
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */

// 게시물 좋아요
router.post('/like', toggleLike);

// 게시물 스크랩
router.post('/scrap', toggleScrap);

// 스크랩한 게시물 목록
router.get('/scrap/info', getScrappedThreads);

// 포스터 작성
/**
 * @swagger
 * /thread/add:
 *   post:
 *     summary: 게시물 추가
 *     description: 게시물 추가, 최대 5개의 이미지 업로드 가능
 *     tags:
 *       - Thread
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *                 description: JSON 형식의 게시물 정보 (문자열로 전달됨)
 *                 example: '{"userTag": "john#123", "postCategory": "여행 기록", "postTitle": "스웨거 테스트 용 제목", "postContent": "스웨거 테스트 용 내용", "clothId": 1}'
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 업로드할 이미지 파일 (최대 5개)
 *     responses:
 *       201:
 *         description: 게시물 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: string
 *                   example: "2010"
 *                 message:
 *                   type: string
 *                   example: "게시물 업로드 성공"
 *                 result:
 *                   type: object
 *                   properties:
 *                     threadId:
 *                       type: integer
 *                       example: 123
 *                     imageUrls:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *       400:
 *         description: "잘못된 요청 (예: JSON 형식 오류, 이미지 업로드 실패)"
 *       500:
 *         description: 서버 오류
 */
router.post('/add', upload.array('files', 5), upLoadPostController);

// 이미지 업로드
// router.post("/upload", upload.array('files', 5), uploadImageController);

// 내가 쓴 포스트 상세 조회
/**
 *  @swagger
 * /thread/info:
 *   get:
 *     summary: 내가 쓴 포스트 상세 조회
 *     description: 특정 사용자가 작성한 특정 게시물의 상세 정보를 조회합니다.
 *     tags:
 *       - Thread
 *     parameters:
 *       - in: query
 *         name: userTag
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 사용자의 태그
 *         example: "john#123"
 *       - in: query
 *         name: threadId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 게시물의 ID
 *         example: 1
 *     responses:
 *       200:
 *         description: 게시물 상세 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 threadId:
 *                   type: integer
 *                   description: 게시물 ID
 *                   example: 1
 *                 postTitle:
 *                   type: string
 *                   description: 게시물 제목
 *                   example: "여행 후기"
 *                 postContent:
 *                   type: string
 *                   description: 게시물 내용
 *                   example: "이번 여행 너무 좋았어요!"
 *                 postDate:
 *                   type: string
 *                   format: date-time
 *                   description: 게시물 작성 날짜
 *                   example: "2024-01-31T12:34:56Z"
 *                 imageUrls:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: 게시물에 포함된 이미지 URL 리스트
 *                   example:
 *                     - "https://example.com/image1.jpg"
 *                     - "https://example.com/image2.jpg"
 *                 likes:
 *                   type: integer
 *                   description: 게시물 좋아요 수
 *                   example: 50
 *                 comments:
 *                   type: integer
 *                   description: 게시물 댓글 수
 *                   example: 10
 *                 scraps:
 *                   type: integer
 *                   description: 게시물 스크랩 수
 *                   example: 5
 *       400:
 *         description: 잘못된 요청 (필수 파라미터 누락 등)
 *       500:
 *         description: 서버 오류
 */
router.get('/info', postInfoController);

/**
 * @swagger
 * /thread/search:
 *   get:
 *     summary: 검색어에 따른 포스트 조회
 *     description: 특정 검색어를 포함하는 게시물을 조회합니다. (이미지, 제목, 날짜만 반환)
 *     tags:
 *       - Thread
 *     parameters:
 *       - in: query
 *         name: searchKeyword
 *         required: true
 *         schema:
 *           type: string
 *         description: "검색할 키워드"
 *         example: "my"
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: "페이지네이션을 위한 오프셋 값 (기본값: 0)"
 *         example: 10
 *     responses:
 *       200:
 *         description: "검색 결과 반환 (이미지, 제목, 날짜만 제공)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       threadId:
 *                         type: integer
 *                         description: "게시물 ID"
 *                         example: 1
 *                       postTitle:
 *                         type: string
 *                         description: "게시물 제목"
 *                         example: "여행 후기"
 *                       postDate:
 *                         type: string
 *                         format: date
 *                         description: "게시물 작성 날짜"
 *                         example: "2024-01-31"
 *                       imageUrl:
 *                         type: string
 *                         description: "게시물 대표 이미지 URL"
 *                         example: "https://example.com/image1.jpg"
 *                 totalResults:
 *                   type: integer
 *                   description: "검색 결과 총 개수"
 *                   example: 50
 *       400:
 *         description: "잘못된 요청 (필수 파라미터 누락 등)"
 *       500:
 *         description: "서버 오류"
 */
router.get('/search', postSearchController);

/**
 * @swagger
 * /thread/my-search:
 *   get:
 *     summary: 내가 쓴 글 조회
 *     description: "특정 사용자가 작성한 게시물 목록을 조회합니다. (이미지, 제목만 반환)"
 *     tags:
 *       - Thread
 *     parameters:
 *       - in: query
 *         name: userTag
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 태그 (ID와 유사한 값)
 *         example: "john#123"
 *     responses:
 *       200:
 *         description: 사용자가 작성한 게시물 목록 반환 (이미지, 제목만 제공)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       threadId:
 *                         type: integer
 *                         description: 게시물 ID
 *                         example: 1
 *                       postTitle:
 *                         type: string
 *                         description: 게시물 제목
 *                         example: "my"
 *                       imageUrl:
 *                         type: string
 *                         description: 게시물 대표 이미지 URL
 *                         example: "https://example.com/image1.jpg"
 *                 totalResults:
 *                   type: integer
 *                   description: 검색된 게시물 총 개수
 *                   example: 5
 *       400:
 *         description: 잘못된 요청 (필수 파라미터 누락 등)
 *       500:
 *         description: 서버 오류
 */
router.get('/specific', myPostSearchController);

// 카테고리 별 게시물 조회
/**
 * @swagger
 * /thread/myCategory:
 *   get:
 *     summary: 카테고리별 게시물 조회
 *     description: 특정 사용자가 작성한 게시물을 카테고리별로 조회합니다.
 *     tags:
 *       - Thread
 *     parameters:
 *       - in: query
 *         name: userTag
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 태그 (ID와 유사한 값)
 *         example: "john#123"
 *       - in: query
 *         name: myCategory
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["여행 기록", "기념품", "여행지", "여행 코디"]
 *         description: "조회할 카테고리 (Enum 값: 여행 기록, 기념품, 여행지, 여행 코디)"
 *         example: "여행기록"
 *     responses:
 *       200:
 *         description: 카테고리별로 필터링된 게시물 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       threadId:
 *                         type: integer
 *                         description: 게시물 ID
 *                         example: 1
 *                       postTitle:
 *                         type: string
 *                         description: 게시물 제목
 *                         example: "여행 후기"
 *                       imageUrl:
 *                         type: string
 *                         description: 게시물 대표 이미지 URL
 *                         example: "https://example.com/image1.jpg"
 *                 totalResults:
 *                   type: integer
 *                   description: 검색된 게시물 총 개수
 *                   example: 5
 *       400:
 *         description: "잘못된 요청 (필수 파라미터 누락 또는 유효하지 않은 카테고리 값)"
 *       500:
 *         description: "서버 오류"
 */
router.get('/category', myPostCategoryController);

/**
 * @swagger
 * /thread/update:
 *   patch:
 *     summary: 게시물 수정
 *     description: 특정 사용자의 게시물을 수정합니다.
 *     tags:
 *       - Thread
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userTag
 *               - threadId
 *               - postCategory
 *               - postTitle
 *               - postContent
 *             properties:
 *               userTag:
 *                 type: string
 *                 description: 사용자 태그 (ID와 유사한 값)
 *                 example: "john#123"
 *               threadId:
 *                 type: integer
 *                 description: 수정할 게시물 ID
 *                 example: 1
 *               postCategory:
 *                 type: string
 *                 enum:
 *                  - "여행 기록"
 *                  - "기념품"
 *                  - "여행지"
 *                  - "여행 코디"
 *                 description: "게시물 카테고리 (Enum 값: 여행 기록, 기념품, 여행지, 여행 코디)"
 *                 example: "여행 기록"
 *               postTitle:
 *                 type: string
 *                 description: 수정할 게시물 제목 (최소 5자 이상)
 *                 example: "여행의 추억"
 *                 minLength: 5
 *               postContent:
 *                 type: string
 *                 description: 수정할 게시물 내용
 *                 example: "이번 여행은 정말 멋졌어요!"
 *     responses:
 *       200:
 *         description: 게시물 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   description: 요청 성공 여부
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: 처리 결과 메시지
 *                   example: "게시물 수정 성공"
 *                 result:
 *                   type: object
 *                   properties:
 *                     threadId:
 *                       type: integer
 *                       description: 수정된 게시물 ID
 *                       example: 1
 *                     updatedTitle:
 *                       type: string
 *                       description: 수정된 제목
 *                       example: "여행의 추억"
 *                     updatedContent:
 *                       type: string
 *                       description: 수정된 내용
 *                       example: "이번 여행은 정말 멋졌어요!"
 *       400:
 *         description: 잘못된 요청 (필수 필드 누락, 유효하지 않은 카테고리 또는 제목 길이 부족)
 *       500:
 *         description: 서버 오류
 */
router.patch('/update', updatePostController);

// 포스트 삭제 (DB상에서 삭제는 잘됨 단 S3에 있는 이미지는 삭제가 안됨 해결해야함)

router.delete('/delete', deletePostController);

/**
 * @swagger
 * /thread/popular:
 *   get:
 *     summary: 인기 게시물 조회
 *     description: 좋아요, 댓글, 스크랩 수를 기반으로 인기 게시물을 정렬하여 조회합니다. 페이지네이션을 지원합니다.
 *     tags:
 *       - Thread
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         required: false
 *         description: "조회할 페이지 (기본값: 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *         required: false
 *         description: "한 페이지에 보여줄 게시물 개수 (기본값: 20)"
 *     responses:
 *       200:
 *         description: 인기 게시물 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   description: 현재 페이지 번호
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   description: 한 페이지당 조회된 게시물 개수
 *                   example: 20
 *                 totalPosts:
 *                   type: integer
 *                   description: 전체 인기 게시물 개수
 *                   example: 100
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       threadId:
 *                         type: integer
 *                         description: 게시물 ID
 *                         example: 1
 *                       postTitle:
 *                         type: string
 *                         description: 게시물 제목
 *                         example: "my travel"
 *                       postDate:
 *                         type: string
 *                         format: date
 *                         description: 게시물 작성 날짜
 *                         example: "2024-01-31"
 *                       imageInfoId:
 *                         type: integer
 *                         description: 대표 이미지 ID
 *                         example: 123
 *                       totalEngagement:
 *                         type: integer
 *                         description: 좋아요, 댓글, 스크랩 수를 합산한 인기 지수
 *                         example: 45
 *       400:
 *         description: 잘못된 요청 (쿼리 파라미터 오류 등)
 *       500:
 *         description: 서버 오류
 */
router.get('/popular', popularPostController);

export default router;
