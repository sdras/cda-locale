<template>
  <div class="new">
    <h3>Add a New Post</h3>
    <form @submit.prevent="addPost">
      <input v-model="newTitle" placeholder="title" required/>
      <input v-model="newAuthor" placeholder="author name" required/>
      <select v-model="newLabel" required>
        <option disabled value="">Add a New label</option>
        <option>science</option>
        <option>math</option>
        <option>poetry</option>
        <option>history</option>
      </select>
      <button type="submit">Add New Blog Post</button>
    </form>
  </div>
</template>

<script>
export default {
  methods: {
    addPost() {
      let addedPost = {
        author: this.newAuthor,
        title: this.newTitle,
        label: this.newLabel
      };
      this.posts.push(addedPost)
      this.newTitle = '';
      this.newAuthor = '';
      this.newLabel = '';
    }
  },
}
</script>

<style scoped>

</style>