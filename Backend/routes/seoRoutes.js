import express from 'express';
import { generateSitemap, generateRobotsTxt } from '../controllers/sitemapController.js';

const router = express.Router();

router.get('/sitemap.xml', generateSitemap);
router.get('/robots.txt', generateRobotsTxt);

export default router;