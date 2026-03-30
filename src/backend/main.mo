import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import List "mo:core/List";

actor {
  type Review = {
    name : Text;
    rating : Nat;
    comment : Text;
  };

  module Review {
    public func compare(review1 : Review, review2 : Review) : Order.Order {
      Nat.compare(review1.rating, review2.rating);
    };
  };

  let reviews = List.empty<Review>();

  public shared ({ caller }) func submitReview(name : Text, rating : Nat, comment : Text) : async () {
    if (rating < 1 or rating > 5) {
      return;
    };

    let review : Review = {
      name;
      rating;
      comment;
    };
    reviews.add(review);
  };

  public query ({ caller }) func getAllReviews() : async [Review] {
    reviews.toArray().sort();
  };

  public query ({ caller }) func getAllReviewsSortedByRating() : async [Review] {
    reviews.toArray().sort();
  };
};
