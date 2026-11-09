
import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema(
  {
    bType: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
    },
    saving: {
      type: String,
      default: "0",
    },
    date:{
       type:Date,
       default:new Date()
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,  
        default: null,
    }
   
  },
  { timestamps: true }
);

const Budget =
  mongoose.models.Budget ||
  mongoose.model("Budget", BudgetSchema);

export default Budget;
