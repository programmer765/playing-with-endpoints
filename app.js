import express from "express";
import {
  createContact,
  getContact,
  updateContact,
  deleteContact,
} from "./contactOperation.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/contact/createContact", createContact);
app.get("/contact/getContact", getContact);
app.post("/contact/updateContact", updateContact);
app.post("/contact/deleteContact", deleteContact);

app.listen(8000, () => {
  console.log("Server is running...");
});
