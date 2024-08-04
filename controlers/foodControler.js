// controllers/foodController.js
import FoodModel from "../models/foodModel.js";
import fs from 'fs';

// Add food item
const addFood = async (req, res) => {
  try {
    let image_filename = `${req.file.filename}`;
    const food = new FoodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: image_filename,
        category: req.body.category,
    });

    await food.save();
    res.status(201).json({ 
        message: "Food item added successfully",
        food: food,
        success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
        message: "Failed to add food item",
        success: false,
    });
  }
};

// Get all food list
const listFood = async (req, res) => {
  try {
    const foods = await FoodModel.find();
    res.status(200).json({
        message: "Food list retrieved successfully",
        foods: foods,
        success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
        message: "Failed to retrieve food list",
        success: false,
    });
  }
};


// Remove food item
const removeFood = async (req, res) => {
    try {
      const { item_id } = req.params;
      const food = await FoodModel.findByIdAndDelete(item_id);
  
      if (!food) {
        return res.status(404).json({
          message: "Food item not found",
          success: false,
        });
      }
  
      // Optionally, delete the image file if stored on the server
      fs.unlink(`upload/${food.image}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
  
      res.status(200).json({
        message: "Food item removed successfully",
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Failed to remove food item",
        success: false,
      });
    }
  };
  
export { addFood, listFood , removeFood };
