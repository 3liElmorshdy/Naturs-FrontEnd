export type Rating = 1 | 2 | 3 | 4 | 5;

export interface ReviewUser {
  _id: string;
  name: string;
  photo?: string;
}

export default interface Review {
  _id: string;
  review: string;
  rating: Rating;
  createdAt: string;

  // In some API responses this can be:
  // - populated user object
  // - user ID string
  // - null when referenced user no longer exists
  user: ReviewUser | string | null;

  // Present in create/update responses and useful for cache updates.
  tour?: string;

  // Mongoose virtual id is sometimes returned as well.
  id?: string;
}