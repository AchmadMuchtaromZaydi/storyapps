import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { subscribePushNotifications } from '../utils/notification-helper'; 

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      })
    });
  }
   _updateNavigation() {
    const token = localStorage.getItem('token');
    const loginLink = document.querySelector('a[href="#/login"]');
    const registerLink = document.querySelector('a[href="#/register"]');

    if (token) {
      if (loginLink) loginLink.style.display = 'none';
      if (registerLink) registerLink.style.display = 'none';
    } else {
      if (loginLink) loginLink.style.display = 'inline';
      if (registerLink) registerLink.style.display = 'inline';
    }
  }
  

  async requestNotificationPermission() {
    // Memastikan notifikasi dapat ditampilkan
    if ('Notification' in window && Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          await subscribePushNotifications();
          console.log("Notifikasi berhasil disubscribe");
        }
      } catch (err) {
        console.error('Gagal subscribe notifikasi:', err);
      }
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];
    if (!page) {
      this.#content.innerHTML = '<h2>Halaman tidak ditemukan</h2>';
      return;
    }

    this.#content.innerHTML = await page.render();
    await page.afterRender();
     this._updateNavigation();

    // Panggil subscribePushNotifications setelah halaman utama ter-render dan login selesai
    // Cek token terlebih dahulu setelah render halaman
    const token = localStorage.getItem('token');
    if (token) {
      await this.requestNotificationPermission(); // Meminta izin untuk notifikasi setelah halaman ter-render
    }
  }
}

export default App;
