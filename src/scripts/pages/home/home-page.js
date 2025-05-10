import HomePresenter from '../../presenters/HomePresenter';
import MapHandler from '../../utils/MapHandler';



const HomePage = {
  async render() {
    return `
      <h2>Daftar Story</h2>
      <div id="auth-buttons" class="auth-buttons">
        <button id="enableNotifBtn" style="display:none;">Aktifkan Notifikasi</button>
      </div>
      <div id="story-list"></div>
      <div id="map" style="height: 400px;"></div>
    `;
  },

  async afterRender() {
    const authButtonsContainer = document.getElementById('auth-buttons');
    const notifBtn = document.getElementById('enableNotifBtn');
    const storyContainer = document.getElementById('story-list');
    const mapHandler = new MapHandler('map');

    const token = localStorage.getItem('token');

    if (!token) {
      storyContainer.innerHTML = '<p>Silakan login untuk melihat cerita.</p>';
      document.getElementById('map').style.display = 'none';
      return;
    }

    // Inisialisasi map dan tampilkan cerita
    mapHandler.initMap();

    const homePresenter = new HomePresenter({
      displayStories: (stories) => {
        storyContainer.innerHTML = '';
        stories.forEach((story) => {
          storyContainer.innerHTML += `
            <div class="story-card">
              <img src="${story.photoUrl}" alt="${story.name}" width="100" loading="lazy" />
              <h3>${story.name}</h3>
              <p><strong>Deskripsi:</strong> ${story.description}</p>
              <p><strong>Tanggal dibuat:</strong> ${new Date(story.createdAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <a href="#/detail/${story.id}" class="button">Lihat Detail</a>
            </div>
          `;
        });

        mapHandler.addMarkers(stories);
      },
      showError: (error) => {
        storyContainer.innerHTML = `<p>Gagal memuat story: ${error.message || 'Terjadi Kesalahan'}</p>`;
        console.error(error);
      }
    }, mapHandler);

    homePresenter.loadStories(token);

  }
};

export default HomePage;

