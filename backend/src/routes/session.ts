import { Router } from 'express';

export const sessionRouter = Router();

sessionRouter.post('/clear', (req, res) => {
  res.status(200).json({
    cleared: true,
    message: 'Session cleared client-side. No server-side secrets stored.',
    requestId: req.requestId
  });
});
