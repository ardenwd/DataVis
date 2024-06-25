<script>
  import { FeedbackStore } from "../stores";
  import { v4 as uuidv4 } from "uuid";
  import Button from "./Button.svelte";
  import Card from "./Card.svelte";
  import RatingSelect from "./RatingSelect.svelte";

  let text = "";
  let rating = 10;
  let btnDisabled = true;
  let min = 5;
  let message;

  const handleSubmit = () => {
    if (text.trim().length > min) {
      const newFeedback = {
        id: uuidv4(),
        text,
        rating: +rating,
      };

      FeedbackStore.update((currentFeedback) => {
        return [newFeedback, ...currentFeedback];
      });

      text = "";
      // console.log(newFeedback);
    }
  };
  const handleSelect = (e) => (rating = e.detail);

  const handleInput = () => {
    // check the text length! make sure to check for whitespace with trm
    if (text.trim().length <= min) {
      message = `Text must be at least ${min} characters`;
      btnDisabled = true;
    } else {
      message = null;
      btnDisabled = false;
    }
  };
</script>

<Card>
  <header>
    <h2>How do you rate this marvelous service?</h2>
  </header>
  <form on:submit|preventDefault={handleSubmit}>
    <RatingSelect on:rating-select={handleSelect} />
    <div class="input-group">
      <input
        type="text"
        on:input={handleInput}
        bind:value={text}
        placeholder="Tell us the truth!"
      />
      <Button disabled={btnDisabled} type="submit">Send</Button>
    </div>
    {#if message}
      <div class="message">
        {message}
      </div>
    {/if}
  </form>
</Card>
