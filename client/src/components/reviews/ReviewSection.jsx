// client/src/components/reviews/ReviewSection.jsx
import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReviewCard from "./ReviewCard";
import { reviewService } from "@/services/reviews";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

const ReviewSection = ({ propertyId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getPropertyReviews(propertyId, {
        page,
        limit: 10,
      });

      if (page === 1) {
        setReviews(data.reviews);
      } else {
        setReviews((prev) => [...prev, ...data.reviews]);
      }

      setTotalCount(data.pagination.totalCount);
      setHasMore(data.pagination.currentPage < data.pagination.totalPages);

      // Calculate average rating
      if (data.reviews.length > 0) {
        const avg =
          data.reviews.reduce(
            (sum, review) => sum + review.ratings.overall,
            0
          ) / data.reviews.length;
        setAverageRating(avg);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId, comment) => {
    if (!user || (user.role !== "host" && user.role !== "admin")) {
      toast.error("Only hosts or admins can reply to reviews.");
      return;
    }

    try {
      await reviewService.addHostReply(reviewId, comment);
      toast.success("Reply posted successfully!");
      setPage(1); // Reset to first page to refetch reviews
    } catch (error) {
      toast.error("Failed to post reply");
      throw error;
    }
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-b border-gray-200 pb-6">
              <div className="flex space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Reviews Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Reviews {totalCount > 0 && `(${totalCount})`}
        </h3>

        {averageRating > 0 && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-semibold">{averageRating.toFixed(1)}</span>
            </div>
            <span className="text-gray-600">Average rating</span>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            No reviews yet. Be the first to review this property!
          </p>
        </div>
      ) : (
        <div>
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onReply={handleReply}
              isHost={user?.role === "host" || user?.role === "admin"}
              canReply={user?.role === "host" || user?.role === "admin"}
            />
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-6">
              <Button variant="outline" onClick={loadMore} disabled={loading}>
                {loading ? "Loading..." : "Show More Reviews"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
