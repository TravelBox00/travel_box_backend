/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */

import { Router } from 'express';
import {
  addCalendar,
  removeCalendar,
  fixCalendar,
} from './calendar.controller.ts';

const router = Router();

/**
 * @swagger
 * /calendar/add:
 *   post:
 *     summary: 일정 추가
 *     tags:
 *       - Calendar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               travelTitle:
 *                 type: string
 *                 example: 가족여행
 *               travelContent:
 *                 type: string
 *                 example: 오사카
 *               travelStartDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-15
 *               travelEndDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-20
 *     responses:
 *       201:
 *         description: Successfully added
 */

/**
 * @swagger
 * /calendar/remove:
 *   delete:
 *     summary: 일정 삭제
 *     tags:
 *       - Calendar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               travelId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       400:
 *         description: travelId는 필수 입력값입니다.
 *       404:
 *         description: 해당 일정이 존재하지 않습니다.
 */

/**
 * @swagger
 * /calendar/fix:
 *   put:
 *     summary: 일정 수정
 *     tags:
 *       - Calendar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               travelId:
 *                 type: integer
 *                 example: 2
 *               travelTitle:
 *                 type: string
 *                 example: 가족여행
 *               travelContent:
 *                 type: string
 *                 example: 오사카
 *               travelStartDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-15
 *               travelEndDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-20
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: travelId는 필수 입력값입니다.
 *       404:
 *         description: 해당 일정이 존재하지 않습니다.
 */

// 일정 추가
router.post('/add', addCalendar);

// 일정 삭제
router.delete('/remove', removeCalendar);

// 일정 수정
router.put('/fix', fixCalendar);

export default router;
