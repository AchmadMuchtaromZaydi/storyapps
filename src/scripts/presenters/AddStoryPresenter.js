import API from '../data/api';
import { sendStoryNotification } from '../utils/notification-helper';


const AddStoryPresenter = {
  init() {
    // Setup lain bisa ditambahkan di sini jika perlu
  },

  async addStory(description, imageData, latitude, longitude) {
    console.log("Data yang dikirim:", { description, imageData, latitude, longitude });

    if (!description || !imageData || !latitude || !longitude) {
      alert("Semua data harus diisi!");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      let response;

      // Pastikan token valid dan bukan string kosong/null
      if (token && token !== 'null' && token !== 'undefined') {
        response = await API.addStory({ description, imageData, latitude, longitude }, token);
      } else {
        response = await API.addGuestStory({ description, imageData, latitude, longitude });
      }

      console.log("Response dari API:", response);

      if (response.message === 'success' || response.message === 'Story created') {
        alert("Story berhasil ditambahkan.");
        await sendStoryNotification({
          title: "Cerita Baru Ditambahkan!",
          body: description,
        });
      } 
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Terjadi kesalahan saat menambahkan cerita.");
    }
  }
};

export default AddStoryPresenter;
