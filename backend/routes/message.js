import express from 'express';

const router = express.Router();

// Temporary mock message endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Message endpoint - not implemented yet'
  });
});

export default router;