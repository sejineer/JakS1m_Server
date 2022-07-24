import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    todoList: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", TodoSchema);

export default Todo;
