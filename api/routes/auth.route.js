import express from 'express'
import { signUp,signIn,google,signout } from '../controller/auth.controller.js';
const router = express.Router();
router.post('/signup',signUp)
router.post('/signin', signIn)
router.post('/google', google)
router.get('/signout', signout)



export default router;