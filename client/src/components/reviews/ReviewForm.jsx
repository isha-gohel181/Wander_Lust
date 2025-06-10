// client/src/components/reviews/ReviewForm.jsx
import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ReviewForm = ({ onSubmit, loading = false }) => {
  const [reviewData, setReviewData] = useState({
    ratings: {
      overall: 0,
      cleanliness: 0,
      communication: 0,
      checkIn: 0,
      accuracy: 0,
      location: 0,
      value: 0,
    },
    comment: "",
  });

  const ratingCategories = [
    { key: "overall", label: "Overall Experience" },
    { key: "cleanliness", label: "Cleanliness" },
    { key: "communication", label: "Communication" },
    { key: "checkIn", label: "Check-in Process" },
    { key: "accuracy", label: "Accuracy of Listing" },
    { key: "location", label: "Location" },
    { key: "value", label: "Value for Money" },
  ];

  const updateRating = (category, rating) => {
    setReviewData((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [category]: rating,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that all ratings are provided
    const hasAllRatings = Object.values(reviewData.ratings).every(
      (rating) => rating > 0
    );
    if (!hasAllRatings) {
      alert("Please provide ratings for all categories");
      return;
    }

    if (!reviewData.comment.trim()) {
      alert("Please write a review comment");
      return;
    }

    onSubmit(reviewData);
  };

  const StarRating = ({ rating, onRatingChange, label }) => (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center space-x-1 mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Rate Your Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ratingCategories.map((category) => (
                <StarRating
                  key={category.key}
                  label={category.label}
                  rating={reviewData.ratings[category.key]}
                  onRatingChange={(rating) =>
                    updateRating(category.key, rating)
                  }
                />
              ))}
            </div>
          </div>

          {/* Written Review */}
          <div>
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience with future guests..."
              value={reviewData.comment}
              onChange={(e) =>
                setReviewData((prev) => ({ ...prev, comment: e.target.value }))
              }
              className="mt-1 min-h-[120px]"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-wanderlust-500 hover:bg-wanderlust-600"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
