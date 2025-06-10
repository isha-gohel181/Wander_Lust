// client/src/components/reviews/ReviewCard.jsx
import React, { useState } from "react";
import { Star, ThumbsUp, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTimeAgo } from "@/utils/helpers";

const ReviewCard = ({ review, onReply, isHost = false, canReply = false }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    try {
      await onReply(review._id, replyText.trim());
      setReplyText("");
      setShowReplyForm(false);
    } catch (error) {
      console.error("Failed to submit reply:", error);
    } finally {
      setSubmittingReply(false);
    }
  };

  const renderStars = (rating) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={review.guest?.avatar} />
            <AvatarFallback>
              {review.guest?.firstName?.[0]}
              {review.guest?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-gray-900">
              {review.guest?.firstName} {review.guest?.lastName}
            </h4>
            <p className="text-sm text-gray-600">
              {formatTimeAgo(review.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {renderStars(review.ratings.overall)}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Report Review</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Detailed Ratings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
        <div>
          <span className="text-gray-600">Cleanliness</span>
          <div className="flex items-center mt-1">
            {renderStars(review.ratings.cleanliness)}
          </div>
        </div>
        <div>
          <span className="text-gray-600">Communication</span>
          <div className="flex items-center mt-1">
            {renderStars(review.ratings.communication)}
          </div>
        </div>
        <div>
          <span className="text-gray-600">Check-in</span>
          <div className="flex items-center mt-1">
            {renderStars(review.ratings.checkIn)}
          </div>
        </div>
        <div>
          <span className="text-gray-600">Value</span>
          <div className="flex items-center mt-1">
            {renderStars(review.ratings.value)}
          </div>
        </div>
      </div>

      {/* Review Comment */}
      <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

      {/* Review Images */}
      {review.images?.length > 0 && (
        <div className="flex space-x-2 mb-4">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`Review image ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Host Reply */}
      {review.hostReply && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold text-gray-900">Host Response</span>
            <span className="text-sm text-gray-500">
              {formatTimeAgo(review.hostReply.createdAt)}
            </span>
          </div>
          <p className="text-gray-700">{review.hostReply.comment}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <ThumbsUp className="h-4 w-4 mr-1" />
            Helpful ({review.helpfulVotes || 0})
          </Button>
        </div>

        {/* Reply Button for Host */}
        {canReply && isHost && !review.hostReply && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReplyForm(true)}
          >
            Reply
          </Button>
        )}
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-4 space-y-3">
          <Textarea
            placeholder="Write a response to this review..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowReplyForm(false);
                setReplyText("");
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleReplySubmit}
              disabled={!replyText.trim() || submittingReply}
              className="bg-wanderlust-500 hover:bg-wanderlust-600"
            >
              {submittingReply ? "Posting..." : "Post Reply"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
