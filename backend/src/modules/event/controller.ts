import { Router } from "express";
import EventService from "./service";
import { authMiddleware } from "../../middleware/authMiddleware";
import upload from "../../utils/fileUploading/multerUpload";

const eventRouter = Router();
eventRouter.get("/", authMiddleware(), EventService.getAllEvents);
eventRouter.get("/:id", authMiddleware(), EventService.getEventById);
eventRouter.post(
    "/",
    authMiddleware("admin"),
    upload.single("image"),
    EventService.createEvent
);
eventRouter.put("/:id", authMiddleware("admin"), EventService.updateEvent);
eventRouter.delete("/:id", authMiddleware("admin"), EventService.deleteEvent);

export default eventRouter;
