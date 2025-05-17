import { Router } from "express";
import EventService from "./service";
import { authMiddleware } from "../../middleware/authMiddleware";
import upload from "../../utils/fileUploading/multerUpload";
import { optionalAuthMiddleware } from "../../middleware/optionalauthMiddleware";

const eventRouter = Router();
eventRouter.get("/", optionalAuthMiddleware, EventService.getAllEvents);
eventRouter.get("/:id", optionalAuthMiddleware, EventService.getEventById);
eventRouter.post(
    "/",
    authMiddleware("admin"),
    upload.single("image"),
    EventService.createEvent
);
eventRouter.put("/:id", authMiddleware("admin"), EventService.updateEvent);
eventRouter.delete("/:id", authMiddleware("admin"), EventService.deleteEvent);

export default eventRouter;
