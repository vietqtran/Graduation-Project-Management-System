import { Router } from "express";
import { SupervisorController } from "../controllers/supervisor.controller";

const router = Router();
const supervisorController = new SupervisorController();

router.get("/get-all",supervisorController.getAllSupervisors); 
router.get("/get-supervisors/:userId", );
router.post("/invite-supervisor");

export { router as supervisorRoutes };