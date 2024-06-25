import {writable} from 'svelte/store'

export const FeedbackStore = writable([

    {
      id: 1,
      rating: 10,
      text: "What a great movie!",
    },
    {
      id: 2,
      rating: 3,
      text: "Kind of a waste of time:/",
    },
    {
      id: 3,
      rating: 7,
      text: "Twas good",
    }
]);
