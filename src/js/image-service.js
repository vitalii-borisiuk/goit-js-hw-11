import { Notify } from "notiflix";
import axios from "axios";


export default class ImageApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    };

    async fetchArticles() {
    const fetchUrl = 'https://pixabay.com/api/';
    const options = {
        apiKey: '33056175-234edcc2e32bf55159d831c60',
        type: 'image_type=photo',
        orientation: 'orientation=horizontal',
        searchSettings: 'safesearch=true',
        per_page: 'per_page=40',
    };

        const { apiKey, type, orientation, searchSettings, per_page } = options;
        return await axios.get(`${fetchUrl}/?key=${apiKey}&q=${this.searchQuery}&${type}&${orientation}&${searchSettings}&${per_page}&page=${this.page}`)
            .then(data => {
                this.incrementPage();
                return data.data
            })
    };

    incrementPage() {
        this.page += 1;
    };

    resetPage() {
        this.page = 1;
    };

    get query() {
        return this.searchQuery;
    };

    set query(newQuery) {
        this.searchQuery = newQuery;
    };
  
};