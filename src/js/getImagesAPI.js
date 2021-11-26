import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

const KEY = '24441832-e1f7ed32578d6107b72c2a05f';

export default class GetImagesApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getImages() {
    const response = await axios
      .get(
        `?per_page=40&page=${this.page}&key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`
      )
      .then(data => {
        this.page += 1;
        return data;
      });
    return response.data;
  }

  resetPage() {
    this.page = 1;
  }

  get input() {
    return this.searchQuery;
  }

  set input(newInput) {
    this.searchQuery = newInput;
  }
}
