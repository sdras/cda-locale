<template>
  <div class="tablearea">

    <select v-model="selected">
      <option disabled value="">Filter with a label</option>
      <option>Science</option>
      <option>Math</option>
      <option>Poetry</option>
      <option>History</option>
    </select>

    <div v-for="(post, i) in filteredByLabel" class="post">
      <span class="label">{{ post.label }}</span>
      <p>{{ post.title }}</p>
      <small>{{ post.author }}</small>
    </div>

  </div>
</template>

<script>
//import NewPost from './components/NewPost.vue';

export default {
  // components: {
  //   NewPost,
  // }
  data() {
    return {
      selected: '',
      posts: [
        {
          author: '@vFitzgerald',
          title: 'Quod Ducimus Omnis',
          label: 'science'
        },
        {
          author: '@mPalmer',
          title: 'Vero Eius Laboriosam Ex Repudiandae',
          label: 'math'
        },
        {
          author: '@mDean',
          title: 'Magnam Odit',
          label: 'science'
        },
        {
          author: '@tCole',
          title: 'Velit Mollitia Voluptates Assumenda',
          label: 'science'
        },
        {
          author: '@jCooper',
          title: 'Eum Commodi Cupiditate',
          label: 'poetry'
        },
        {
          author: '@lLamb',
          title: 'Amet',
          label: 'history'
        },
        {
          author: '@fMartin',
          title: 'Voluptatem Fuga Cum Asperiores Error',
          label: 'science'
        },
        {
          author: '@eHayes',
          title: 'Ipsa Consectetur Rerum Repellat Quia',
          label: 'math'
        },
        {
          author: '@cCollier',
          title: 'Dolor Nihil Delectus',
          label: 'science'
        },
        {
          author: '@cBenson',
          title: 'Labore Ipsum Ad Pariatur',
          label: 'poetry'
        }
      ],
      newTitle: '',
      newAuthor: '',
      newLabel: '',
    }
  },
  computed: {
    filteredByLabel() {
      let filter = new RegExp(this.selected, 'i')
      return this.posts.filter(el => el.label.match(filter))
    }
  }
}
</script>

<style scoped>
.tablearea {
  background: #332E5C;
}

h2 {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-align: center;
}

li {
  list-style: none;
  span {
    display: inline-block;
    width: 100px;
  }
}

input,
select {
  font-family: 'Work Sans', sans-serif;
}

button {
  color: white;
  border: none;
  border-radius: 3px;
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  font-size: 13px;
  width: 97.5%;
  text-align: center;
  padding: 10px 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: 0.25s all ease;
  background: #222;
  margin-bottom: 15px;
  &:hover {
    transform: translateY(1px);
  }
}

select {
  width: 100%;
}

.post,
.new {
  background: #eee;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 10px 20px;
  margin: 5px 0 10px;
  p {
    font-weight: bold;
    margin: 10px 0 5px;
  }
}

.new {
  background: #666;
  border: #222;
  margin-bottom: 40px;
  input {
    margin: 0 0 10px;
  }
  select {
    width: 97.5%;
    margin-bottom: 10px;
  }
  h3 {
    text-transform: uppercase;
    font-weight: 300;
    letter-spacing: 0.05em;
    margin: 10px 0;
    color: white;
  }
}

.label {
  border: 1px solid black;
  background: white;
  color: black;
  float: right;
  margin-top: 10px;
  padding: 5px 10px;
  border-radius: 3px;
}
</style>