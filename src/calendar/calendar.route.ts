/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */

import { Router } from 'express';
import { addCalendar } from './calendar.controller.ts';

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

// 일정 추가
router.post('/add', addCalendar);

export default router;
