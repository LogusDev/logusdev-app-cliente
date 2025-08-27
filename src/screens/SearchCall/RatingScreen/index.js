
import { useState } from "react";
import StarRating from "react-native-star-rating-widget";

export default function RatingScreen(){
    const [rating,setRating] = useState(0)

    return(
        <StarRating
            rating={rating}
            onChange={setRating}
            maxStars={5}
        />
    )
}