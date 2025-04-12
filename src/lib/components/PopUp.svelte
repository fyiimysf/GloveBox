<script lang="ts">
    import { page } from "$app/state";
    
</script>

<div class="flex flex-col items-center justify-center h-screen">
  <h1 class="text-2xl font-bold mb-4">Card Details</h1>
  <p class="text-lg">This is the card details page.</p>
  <p class="text-lg">Card ID: s</p>
  <a href="/card" class="mt-4 text-blue-500 hover:underline">Back to Cards</a>
  <div class="mt-4">
    <!-- svelte-ignore a11y_img_redundant_alt -->
    <img src="/path/to/card-image.jpg" alt="Card Image" class="w-64 h-64 object-cover rounded-lg shadow-lg">
    </div>
</div>